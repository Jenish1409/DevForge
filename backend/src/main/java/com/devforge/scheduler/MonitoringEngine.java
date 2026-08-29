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
import io.netty.channel.ChannelOption;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Background scheduler that checks all enabled monitored APIs at their configured intervals.
 * Uses WebClient with proper timeouts and runs blocking DB writes on the scheduler thread.
 */
@Slf4j
@Component
public class MonitoringEngine {

    private final MonitoredApiRepository apiRepository;
    private final ApiCheckHistoryRepository historyRepository;
    private final ApiIncidentRepository incidentRepository;
    private final EmailService emailService;
    private final EncryptionUtils encryptionUtils;

    private final Map<Long, Long> lastCheckTimes = new ConcurrentHashMap<>();
    private final WebClient webClient;

    public MonitoringEngine(MonitoredApiRepository apiRepository,
                            ApiCheckHistoryRepository historyRepository,
                            ApiIncidentRepository incidentRepository,
                            EmailService emailService,
                            EncryptionUtils encryptionUtils) {
        this.apiRepository = apiRepository;
        this.historyRepository = historyRepository;
        this.incidentRepository = incidentRepository;
        this.emailService = emailService;
        this.encryptionUtils = encryptionUtils;

        // Build WebClient with connect/read timeouts
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10_000)
                .responseTimeout(Duration.ofSeconds(10));

        this.webClient = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    @Scheduled(fixedRate = 10000)
    public void runChecks() {
        List<MonitoredApi> apis;
        try {
            apis = apiRepository.findAllWithUser();
        } catch (Exception e) {
            log.error("Failed to load monitored APIs", e);
            return;
        }

        long now = System.currentTimeMillis();

        for (MonitoredApi api : apis) {
            if (!api.getEnabled()) continue;
            if (api.getRateLimitUntil() != null
                    && LocalDateTime.now().isBefore(api.getRateLimitUntil())) {
                continue;
            }
            long lastCheck = lastCheckTimes.getOrDefault(api.getId(), 0L);
            long intervalMs = api.getIntervalSeconds() * 1000L;
            if ((now - lastCheck) < intervalMs) continue;

            lastCheckTimes.put(api.getId(), now);
            checkApi(api);
        }
    }

    private void checkApi(MonitoredApi api) {
        long startTime = System.currentTimeMillis();
        String userEmail = api.getUser().getEmail();

        try {
            WebClient.RequestHeadersSpec<?> request = webClient
                    .method(HttpMethod.valueOf(api.getMethod()))
                    .uri(api.getUrl());

            // Add API key as X-Api-Key header (matching DevForge mock endpoint auth)
            if (api.getApiKey() != null && !api.getApiKey().isEmpty()) {
                try {
                    String decryptedKey = encryptionUtils.decrypt(api.getApiKey());
                    String headerName = api.getAuthHeaderName() != null && !api.getAuthHeaderName().trim().isEmpty() ? api.getAuthHeaderName().trim() : "Authorization";
                    request = request.header(headerName, decryptedKey);
                } catch (Exception e) {
                    log.error("Failed to decrypt API key for {}", api.getName(), e);
                }
            }

            // Blocking call â€” retrieve().toBodilessEntity() properly releases the body
            var responseEntity = request
                    .retrieve()
                    .toBodilessEntity()
                    .block(Duration.ofSeconds(15));

            long responseTime = System.currentTimeMillis() - startTime;

            if (responseEntity != null) {
                int statusCode = responseEntity.getStatusCode().value();
                boolean isUp = !responseEntity.getStatusCode().is4xxClientError()
                        && !responseEntity.getStatusCode().is5xxServerError();
                recordResult(api, userEmail,
                        isUp ? CheckStatus.UP : CheckStatus.DOWN,
                        (int) responseTime, statusCode);
            } else {
                recordResult(api, userEmail, CheckStatus.DOWN,
                        (int) responseTime, 0);
            }
        } catch (org.springframework.web.reactive.function.client.WebClientResponseException e) {
            long responseTime = System.currentTimeMillis() - startTime;
            int statusCode = e.getStatusCode().value();
            log.debug("Health check returned error status for {} ({}): HTTP {}", api.getName(), api.getUrl(), statusCode);
            recordResult(api, userEmail, CheckStatus.DOWN, (int) responseTime, statusCode);
        } catch (Exception e) {
            long responseTime = System.currentTimeMillis() - startTime;
            log.debug("Health check failed for {} ({}): {}", api.getName(), api.getUrl(), e.getMessage());
            recordResult(api, userEmail, CheckStatus.DOWN, (int) responseTime, 0);
        }
    }

    private void recordResult(MonitoredApi api, String userEmail,
                              CheckStatus status, int responseTimeMs, int statusCode) {
        try {
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

            api.setLastCheckedAt(LocalDateTime.now());
            boolean apiUpdated = true;

            if (status == CheckStatus.DOWN) {
                int failures = api.getConsecutiveFailures() == null
                        ? 0 : api.getConsecutiveFailures();
                api.setConsecutiveFailures(failures + 1);

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
                }
                if (api.getAlertSent() != null && api.getAlertSent()) {
                    emailService.sendApiRecoveryAlert(userEmail, api.getName());
                    api.setAlertSent(false);
                }
                if (api.getRateLimitUntil() != null) {
                    api.setRateLimitUntil(null);
                }
            }

            apiRepository.save(api);

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
        } catch (Exception e) {
            log.error("Failed to record result for {}: {}", api.getName(), e.getMessage());
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

