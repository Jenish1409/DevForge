package com.devforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EndpointRequest {

    private String method;
    private String path;

    @Builder.Default
    private int statusCode = 200;

    private String responseBody;

    @Builder.Default
    private String contentType = "application/json";

    @Builder.Default
    private Integer delayMs = 0;
}
