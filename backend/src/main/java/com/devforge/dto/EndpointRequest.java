package com.devforge.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EndpointRequest {

    @NotBlank(message = "HTTP method is required")
    private String method;

    @NotBlank(message = "Path is required")
    private String path;

    @Builder.Default
    @NotNull(message = "Status code is required")
    private Integer statusCode = 200;

    private String responseBody;

    @Builder.Default
    private String contentType = "application/json";

    @Builder.Default
    private Integer delayMs = 0;
}
