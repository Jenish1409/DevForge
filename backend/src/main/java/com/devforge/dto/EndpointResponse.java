package com.devforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EndpointResponse {

    private UUID id;
    private String method;
    private String path;
    private int statusCode;
    private String responseBody;
    private String contentType;
    private LocalDateTime createdAt;
}
