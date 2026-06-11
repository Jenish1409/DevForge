package com.devforge.controller;

import com.devforge.dto.CachedMockResponse;
import com.devforge.service.MockEndpointService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/mock/{projectId}")
@RequiredArgsConstructor
public class DynamicMockController {

    private final MockEndpointService mockEndpointService;

    private static final String PATH_PREFIX = "/mock/";

    /**
     * Wildcard handler that intercepts ALL HTTP methods on {@code /mock/{projectId}/**}.
     *
     * <p>Extracts the trailing sub-path after the projectId segment and delegates
     * to {@link MockEndpointService} for route resolution via AntPathMatcher.
     *
     * @param projectId the project UUID from the URL
     * @param request   the raw servlet request for method and URI extraction
     * @return a dynamically constructed ResponseEntity with the mock's status, headers, and body
     */
    @RequestMapping("/**")
    public ResponseEntity<String> handleMockRequest(@PathVariable String projectId,
                                                     HttpServletRequest request) {
        String method = request.getMethod();
        String subPath = extractSubPath(request.getRequestURI(), projectId);

        CachedMockResponse cached = mockEndpointService.executeMock(projectId, method, subPath);
        request.setAttribute("mock.endpointId", cached.getEndpointId());

        // Simulate network delay if configured
        if (cached.getDelayMs() > 0) {
            try {
                Thread.sleep(cached.getDelayMs());
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_TYPE, cached.getContentType());

        return ResponseEntity
                .status(cached.getStatusCode())
                .headers(headers)
                .body(cached.getResponseBody());
    }

    /**
     * Extracts the trailing sub-path from the full request URI.
     *
     * <p>Example: {@code /mock/abc-123/users/42} → {@code /users/42}
     *
     * @param requestUri the full request URI
     * @param projectId  the project ID segment to strip
     * @return the trailing path starting with {@code /}
     */
    private String extractSubPath(String requestUri, String projectId) {
        // Find the end of "/mock/{projectId}" in the URI
        String prefix = PATH_PREFIX + projectId;
        int prefixEnd = requestUri.indexOf(prefix);

        if (prefixEnd == -1) {
            return "/";
        }

        String subPath = requestUri.substring(prefixEnd + prefix.length());

        // Ensure the path starts with /
        if (subPath.isEmpty()) {
            return "/";
        }

        return subPath;
    }
}
