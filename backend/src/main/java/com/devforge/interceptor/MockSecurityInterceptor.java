package com.devforge.interceptor;

import com.devforge.entity.Project;
import com.devforge.exception.InvalidApiKeyException;
import com.devforge.exception.RateLimitExceededException;
import com.devforge.repository.ProjectRepository;
import com.devforge.service.RateLimitingService;
import com.devforge.util.ApiKeyUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class MockSecurityInterceptor implements HandlerInterceptor {

    private final RateLimitingService rateLimitingService;
    private final ProjectRepository projectRepository;

    private static final String PATH_PREFIX = "/mock/";

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request,
                             @NonNull HttpServletResponse response,
                             @NonNull Object handler) {

        // Step 1: Rate limit check
        String ipAddress = resolveClientIp(request);
        if (rateLimitingService.isRateLimited(ipAddress)) {
            throw new RateLimitExceededException(ipAddress);
        }

        // Project and API key validation are now deferred to MockEndpointService
        // to enable zero-database-hit caching.

        return true;
    }

    private UUID extractProjectId(String requestUri) {
        try {
            String afterPrefix = requestUri.substring(PATH_PREFIX.length());
            String projectIdStr = afterPrefix.contains("/")
                    ? afterPrefix.substring(0, afterPrefix.indexOf("/"))
                    : afterPrefix;
            return UUID.fromString(projectIdStr);
        } catch (Exception e) {
            return null;
        }
    }

    private String resolveClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
