package com.devforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonitoringDashboardResponse {

    private long totalApis;
    private long upApis;
    private long downApis;
    private long incidentsToday;
    private double avgResponseTime;
}
