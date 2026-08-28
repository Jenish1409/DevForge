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
public class CheckHistoryResponse {

    private Long id;
    private String status;
    private Integer responseTimeMs;
    private Integer statusCode;
    private LocalDateTime checkedAt;
    private String errorReason;
}
