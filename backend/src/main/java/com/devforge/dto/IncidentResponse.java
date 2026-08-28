package com.devforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentResponse {

    private Long id;
    private String statusChange;
    private Integer statusCode;
    private LocalDateTime timestamp;
    private String reason;
}
