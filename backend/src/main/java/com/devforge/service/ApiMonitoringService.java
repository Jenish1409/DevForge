package com.devforge.service;

import com.devforge.dto.*;
import com.devforge.entity.*;
import com.devforge.repository.*;
import com.devforge.util.EncryptionUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApiMonitoringService {

    private final MonitoredApiRepository apiRepository;
    private final ApiCheckHistoryRepository historyRepository;
    private final ApiIncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final EncryptionUtils encryptionUtils;

    public MonitoredApi createApi(MonitoredApiRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MonitoredApi api = MonitoredApi.builder()
                .name(request.getName())
                .url(request.getUrl())
                .method(request.getMethod())
                .intervalSeconds(request.getIntervalSeconds())
                .enabled(true)
                .lastCheckedAt(LocalDateTime.now().minusDays(1))
                .user(user)
                .build();

        if (request.getApiKey() != null && !request.getApiKey().trim().isEmpty()) {
            api.setApiKey(encryptionUtils.encrypt(request.getApiKey().trim()));
        }

        return apiRepository.save(api);
    }

    public List<MonitoredApiResponse> getUserApis(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<MonitoredApi> apis = apiRepository.findByUserId(user.getId());

        List<MonitoredApiResponse> responses = new ArrayList<>();
        for (MonitoredApi api : apis) {
            responses.add(buildApiResponse(api));
        }
        return responses;
    }

    public MonitoringDashboardResponse getDashboardSummary(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<MonitoredApi> apis = apiRepository.findByUserId(user.getId());

        long totalApis = apis.size();
        long upApis = 0;
        long downApis = 0;
        double totalAvgResponse = 0;
        int apisWithResponseData = 0;

        for (MonitoredApi api : apis) {
            Optional<ApiCheckHistory> latestCheck = historyRepository
                    .findTopByApiIdOrderByCheckedAtDesc(api.getId());
            if (latestCheck.isPresent()) {
                if (latestCheck.get().getStatus() == CheckStatus.UP) {
                    upApis++;
                } else {
                    downApis++;
                }
            }
            Double avgResponse = historyRepository.getAverageResponseTime(api.getId());
            if (avgResponse != null && avgResponse > 0) {
                totalAvgResponse += avgResponse;
                apisWithResponseData++;
            }
        }

        double overallAvgResponse = apisWithResponseData > 0
                ? totalAvgResponse / apisWithResponseData : 0.0;

        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        long incidentsToday = 0;
        for (MonitoredApi api : apis) {
            long apiIncidentsToday = incidentRepository
                    .findByApiIdOrderByTimestampDesc(api.getId()).stream()
                    .filter(i -> i.getTimestamp().isAfter(startOfDay))
                    .count();
            incidentsToday += apiIncidentsToday;
        }

        return MonitoringDashboardResponse.builder()
                .totalApis(totalApis)
                .upApis(upApis)
                .downApis(downApis)
                .incidentsToday(incidentsToday)
                .avgResponseTime(overallAvgResponse)
                .build();
    }

    public MonitoredApiResponse getApiDetails(Long apiId, String username) {
        validateOwner(apiId, username);
        MonitoredApi api = apiRepository.findById(apiId).get();
        return buildApiResponse(api);
    }

    public List<CheckHistoryResponse> getApiHistory(Long apiId, String username) {
        validateOwner(apiId, username);
        return historyRepository.findByApiIdOrderByCheckedAtDesc(apiId).stream()
                .map(history -> CheckHistoryResponse.builder()
                        .id(history.getId())
                        .status(history.getStatus().name())
                        .responseTimeMs(history.getResponseTimeMs())
                        .statusCode(history.getStatusCode())
                        .checkedAt(history.getCheckedAt())
                        .errorReason(getReasonForStatusCode(
                                history.getStatusCode() != null ? history.getStatusCode() : 0))
                        .build())
                .collect(Collectors.toList());
    }

    public List<IncidentResponse> getApiIncidents(Long apiId, String username) {
        validateOwner(apiId, username);
        return incidentRepository.findByApiIdOrderByTimestampDesc(apiId).stream()
                .map(incident -> IncidentResponse.builder()
                        .id(incident.getId())
                        .statusChange(incident.getStatusChange().name())
                        .statusCode(incident.getStatusCode())
                        .timestamp(incident.getTimestamp())
                        .reason(getReasonForStatusCode(
                                incident.getStatusCode() != null ? incident.getStatusCode() : 0))
                        .build())
                .collect(Collectors.toList());
    }

    public void updateApi(Long apiId, MonitoredApiRequest request, String username) {
        validateOwner(apiId, username);
        MonitoredApi api = apiRepository.findById(apiId).get();
        api.setName(request.getName());
        api.setUrl(request.getUrl());
        api.setMethod(request.getMethod());
        api.setIntervalSeconds(request.getIntervalSeconds());

        if (request.getApiKey() != null && !request.getApiKey().trim().isEmpty()) {
            api.setApiKey(encryptionUtils.encrypt(request.getApiKey().trim()));
        } else {
            api.setApiKey(null);
        }

        apiRepository.save(api);
    }

    public void deleteApi(Long apiId, String username) {
        validateOwner(apiId, username);
        historyRepository.deleteAll(
                historyRepository.findByApiIdOrderByCheckedAtDesc(apiId));
        incidentRepository.deleteAll(
                incidentRepository.findByApiIdOrderByTimestampDesc(apiId));
        apiRepository.deleteById(apiId);
    }

    public void toggleApi(Long apiId, String username) {
        validateOwner(apiId, username);
        MonitoredApi api = apiRepository.findById(apiId).get();
        api.setEnabled(!api.getEnabled());
        apiRepository.save(api);
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private void validateOwner(Long apiId, String username) {
        MonitoredApi api = apiRepository.findById(apiId)
                .orElseThrow(() -> new RuntimeException("API not found"));
        if (!api.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
    }

    private MonitoredApiResponse buildApiResponse(MonitoredApi api) {
        String status = "UNKNOWN";
        Optional<ApiCheckHistory> latestCheck = historyRepository
                .findTopByApiIdOrderByCheckedAtDesc(api.getId());
        if (latestCheck.isPresent()) {
            status = latestCheck.get().getStatus().name();
        }

        long totalChecks = historyRepository.countByApiId(api.getId());
        long successChecks = historyRepository.countByApiIdAndStatus(
                api.getId(), CheckStatus.UP);
        double uptime = totalChecks > 0
                ? (double) successChecks / totalChecks * 100 : 100.0;

        Double avgResponse = historyRepository.getAverageResponseTime(api.getId());
        if (avgResponse == null) avgResponse = 0.0;

        long incidentCount = incidentRepository.countByApiId(api.getId());

        List<String> recentStatuses = historyRepository
                .findTop10ByApiIdOrderByCheckedAtDesc(api.getId())
                .stream().map(h -> h.getStatus().name())
                .collect(Collectors.toList());

        return MonitoredApiResponse.builder()
                .id(api.getId())
                .name(api.getName())
                .url(api.getUrl())
                .method(api.getMethod())
                .intervalSeconds(api.getIntervalSeconds())
                .currentStatus(status)
                .averageResponseTime(avgResponse)
                .uptimePercentage(uptime)
                .enabled(api.getEnabled())
                .totalChecks(totalChecks)
                .lastCheckedAt(api.getLastCheckedAt())
                .rateLimitUntil(api.getRateLimitUntil())
                .incidentCount(incidentCount)
                .recentStatuses(recentStatuses)
                .build();
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
