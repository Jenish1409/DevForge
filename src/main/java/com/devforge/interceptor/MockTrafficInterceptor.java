package com.devforge.interceptor;

import com.devforge.service.RequestLoggingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MockTrafficInterceptor implements HandlerInterceptor {

    private final RequestLoggingService requestLoggingService;

    private static final String START_TIME_ATTR = "mock.startTime";
    private static final String ENDPOINT_ID_ATTR = "mock.endpointId";
    private static final String PATH_PREFIX = "/mock/";

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request,
                             @NonNull HttpServletResponse response,
                             @NonNull Object handler) {
        request.setAttribute(START_TIME_ATTR, System.currentTimeMillis());
        return true;
    }

    @Override
    public void afterCompletion(@NonNull HttpServletRequest request,
                                @NonNull HttpServletResponse response,
                                @NonNull Object handler,
                                @Nullable Exception ex) {
        try {
            // Calculate latency
            Long startTime = (Long) request.getAttribute(START_TIME_ATTR);
            long latencyMs = (startTime != null)
                    ? System.currentTimeMillis() - startTime
                    : 0;

            // Extract projectId from URI: /mock/{projectId}/...
            UUID projectId = extractProjectId(request.getRequestURI());
            if (projectId == null) {
                return; // Can't log without a valid projectId
            }

            // Read endpointId set by the controller (null if 404)
            UUID endpointId = (UUID) request.getAttribute(ENDPOINT_ID_ATTR);

            // Extract sub-path
            String subPath = extractSubPath(request.getRequestURI(), projectId.toString());

            // Resolve client IP (handles proxies/Docker)
            String ipAddress = resolveClientIp(request);

            // Fire-and-forget async logging
            requestLoggingService.logRequest(
                    projectId,
                    endpointId,
                    request.getMethod(),
                    subPath,
                    ipAddress,
                    response.getStatus(),
                    latencyMs
            );
        } catch (Exception ignored) {
            // Logging should never break the response flow
        }
    }

    private UUID extractProjectId(String requestUri) {
        try {
            // URI format: /mock/{projectId}/...
            String afterPrefix = requestUri.substring(PATH_PREFIX.length());
            String projectIdStr = afterPrefix.contains("/")
                    ? afterPrefix.substring(0, afterPrefix.indexOf("/"))
                    : afterPrefix;
            return UUID.fromString(projectIdStr);
        } catch (Exception e) {
            return null;
        }
    }

    private String extractSubPath(String requestUri, String projectId) {
        String prefix = PATH_PREFIX + projectId;
        int prefixEnd = requestUri.indexOf(prefix);
        if (prefixEnd == -1) {
            return "/";
        }
        String subPath = requestUri.substring(prefixEnd + prefix.length());
        return subPath.isEmpty() ? "/" : subPath;
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // X-Forwarded-For may contain multiple IPs; first is the original client
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
