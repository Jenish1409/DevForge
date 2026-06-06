package com.devforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CachedMockResponse implements Serializable {

    private UUID endpointId;
    private int statusCode;
    private String responseBody;
    private String contentType;
}
