package com.devforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonitoredApiResponse {

    private Long id;
    private String name;
    private String url;
    private String method;
    private Integer intervalSeconds;
    private String currentStatus;
    private Double averageResponseTime;
    private Double uptimePercentage;
    private Boolean enabled;
    private Long totalChecks;
    private LocalDateTime lastCheckedAt;
    private LocalDateTime rateLimitUntil;
    private Long incidentCount;
    private List<String> recentStatuses;
    private String authHeaderName;
}

