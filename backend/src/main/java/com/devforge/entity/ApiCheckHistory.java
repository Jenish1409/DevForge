package com.devforge.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "api_check_histories")
public class ApiCheckHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_id", nullable = false)
    private MonitoredApi api;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CheckStatus status;

    @Column(name = "response_time_ms")
    private Integer responseTimeMs;

    @Column(name = "status_code")
    private Integer statusCode;

    @Column(name = "checked_at", nullable = false)
    @Builder.Default
    private LocalDateTime checkedAt = LocalDateTime.now();
}
