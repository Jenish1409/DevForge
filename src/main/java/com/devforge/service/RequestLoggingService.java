package com.devforge.service;

import com.devforge.entity.MockRequestLog;
import com.devforge.repository.MockRequestLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RequestLoggingService {

    private final MockRequestLogRepository mockRequestLogRepository;

    /**
     * Asynchronously persists a mock request log entry.
     *
     * <p>This method runs on the {@code loggingExecutor} thread pool,
     * so the mock response is returned to the caller before this completes.
     *
     * @param projectId  the project UUID
     * @param endpointId the matched endpoint UUID (null if 404)
     * @param method     the HTTP method
     * @param path       the requested sub-path
     * @param ipAddress  the client's IP address
     * @param statusCode the HTTP response status code
     * @param latencyMs  the request processing time in milliseconds
     */
    @Async("loggingExecutor")
    public void logRequest(UUID projectId, UUID endpointId, String method,
                           String path, String ipAddress, int statusCode, long latencyMs) {
        MockRequestLog log = MockRequestLog.builder()
                .projectId(projectId)
                .endpointId(endpointId)
                .method(method)
                .path(path)
                .ipAddress(ipAddress)
                .statusCode(statusCode)
                .latencyMs(latencyMs)
                .build();

        mockRequestLogRepository.save(log);
    }
}
