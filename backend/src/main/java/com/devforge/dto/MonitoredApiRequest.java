package com.devforge.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MonitoredApiRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String url;

    @NotBlank
    private String method;

    @NotNull
    @Min(value = 30, message = "Monitoring interval must be at least 30 seconds")
    private Integer intervalSeconds;

    private String apiKey;

    private String authHeaderName;
}

