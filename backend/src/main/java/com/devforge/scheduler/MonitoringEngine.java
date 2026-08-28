package com.devforge.scheduler;

import com.devforge.entity.ApiCheckHistory;
import com.devforge.entity.ApiIncident;
import com.devforge.entity.CheckStatus;
import com.devforge.entity.IncidentStatus;
import com.devforge.entity.MonitoredApi;
import com.devforge.repository.ApiCheckHistoryRepository;
import com.devforge.repository.ApiIncidentRepository;
import com.devforge.repository.MonitoredApiRepository;
import com.devforge.service.EmailService;
import com.devforge.util.EncryptionUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Background scheduler that checks all enabled monitored APIs at their configured intervals.
 * Uses WebClient (non-blocking) to perform HTTP checks every 10 seconds.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class MonitoringEngine {

    private final MonitoredApiRepository apiRepository;
    private final ApiCheckHistoryRepository historyRepository;
    private final ApiIncidentRepository incidentRepository;
    private final EmailService emailService;
    private final EncryptionUtils encryptionUtils;

    private final Map<Long, Long> lastCheckTimes = new ConcurrentHashMap<>();
    private final WebClient webClient = WebClient.builder().build();

    @Scheduled(fixedRate = 10000)
    public void runChecks() {
        // JOIN FETCH user so it's available on Netty IO threads
        List<MonitoredApi> apis = apiRepository.findAllWithUser();
        long now = System.currentTimeMillis();

        Flux.fromIterable(apis)
            .filter(api -> {
                if (!api.getEnabled()) return false;
                if (api.getRateLimitUntil() != null
                        && LocalDateTime.now().isBefore(api.getRateLimitUntil())) {
                    return false;
                }
                long lastCheck = lastCheckTimes.getOrDefault(api.getId(), 0L);
                long intervalMs = api.getIntervalSeconds() * 1000L;
                return (now - lastCheck) >= intervalMs;
            })
            .flatMap(api -> {
                lastCheckTimes.put(api.getId(), now);
                long startTime = System.currentTimeMillis();
                final String userEmail = api.getUser().getEmail();

                WebClient.RequestHeadersSpec<?> request = webClient
                        .method(HttpMethod.valueOf(api.getMethod()))
                        .uri(api.getUrl());

                if (api.getApiKey() != null && !api.getApiKey().isEmpty()) {
                    try {
                        String decryptedKey = encryptionUtils.decrypt(api.getApiKey());
                        request = (WebClient.RequestHeadersSpec<?>)
                                ((WebClient.RequestHeadersSpec<?>) request)
                                .header("Authorization", "Bearer " + decryptedKey);
                    } catch (Exception e) {
                        log.error("Failed to decrypt API key for {}", api.getName(), e);
                    }
                }

                return request.exchangeToMono(response -> {
                            long responseTime = System.currentTimeMillis() - startTime;
                            HttpStatusCode statusCode = response.statusCode();
                            boolean isUp = !statusCode.is4xxClientError()
                                    && !statusCode.is5xxServerError();
                            recordResult(api, userEmail,
                                    isUp ? CheckStatus.UP : CheckStatus.DOWN,
                                    (int) responseTime, statusCode.value());
                            return Mono.empty();
                        })
                        .onErrorResume(e -> {
                            long responseTime = System.currentTimeMillis() - startTime;
                            recordResult(api, userEmail, CheckStatus.DOWN,
                                    (int) responseTime, 0);
                            return Mono.empty();
                        });
            })
            .subscribe();
    }

    private void recordResult(MonitoredApi api, String userEmail,
                              CheckStatus status, int responseTimeMs, int statusCode) {
        Optional<ApiCheckHistory> lastCheckOpt = historyRepository
                .findTopByApiIdOrderByCheckedAtDesc(api.getId());
        CheckStatus lastStatus = lastCheckOpt
                .map(ApiCheckHistory::getStatus).orElse(CheckStatus.UP);

        ApiCheckHistory history = ApiCheckHistory.builder()
                .api(api)
                .status(status)
                .responseTimeMs(responseTimeMs)
                .statusCode(statusCode)
                .build();
        historyRepository.save(history);

        boolean apiUpdated = false;

        if (status == CheckStatus.DOWN) {
            int failures = api.getConsecutiveFailures() == null
                    ? 0 : api.getConsecutiveFailures();
            api.setConsecutiveFailures(failures + 1);
            apiUpdated = true;

            if (api.getConsecutiveFailures() >= 3
                    && (api.getAlertSent() == null || !api.getAlertSent())) {
                String reason = getReasonForStatusCode(statusCode);
                emailService.sendApiDownAlert(userEmail, api.getName(),
                        statusCode, reason);
                api.setAlertSent(true);
            }

            if (statusCode == 429) {
                api.setRateLimitUntil(LocalDateTime.now().plusMinutes(5));
            }
        } else if (status == CheckStatus.UP) {
            if (api.getConsecutiveFailures() != null
                    && api.getConsecutiveFailures() > 0) {
                api.setConsecutiveFailures(0);
                apiUpdated = true;
            }
            if (api.getAlertSent() != null && api.getAlertSent()) {
                emailService.sendApiRecoveryAlert(userEmail, api.getName());
                api.setAlertSent(false);
                apiUpdated = true;
            }
            if (api.getRateLimitUntil() != null) {
                api.setRateLimitUntil(null);
                apiUpdated = true;
            }
        }

        if (apiUpdated) {
            apiRepository.save(api);
        }

        // Record incidents on status transitions
        if (lastStatus == CheckStatus.UP && status == CheckStatus.DOWN) {
            ApiIncident incident = ApiIncident.builder()
                    .api(api)
                    .statusChange(IncidentStatus.DOWN)
                    .statusCode(statusCode)
                    .build();
            incidentRepository.save(incident);
        } else if (lastStatus == CheckStatus.DOWN && status == CheckStatus.UP) {
            ApiIncident incident = ApiIncident.builder()
                    .api(api)
                    .statusChange(IncidentStatus.RECOVERED)
                    .statusCode(statusCode)
                    .build();
            incidentRepository.save(incident);
        }
    }

    private String getReasonForStatusCode(int statusCode) {
        return switch (statusCode) {
            case 200 -> "OK";
            case 403 -> "Forbidden access";
            case 404 -> "Endpoint not found";
            case 429 -> "API rate limit exceeded";
            case 500 -> "Server error";
            case 0 -> "API not responding / Timeout";
            default -> "HTTP " + statusCode;
        };
    }
}
