package com.devforge.service;

import com.devforge.dto.CachedMockResponse;
import com.devforge.entity.MockEndpoint;
import com.devforge.exception.MockNotFoundException;
import com.devforge.repository.MockEndpointRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MockEndpointService {

    private final MockEndpointRepository mockEndpointRepository;
    private final com.devforge.repository.ProjectRepository projectRepository;
    private final CacheManager cacheManager;

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    /**
     * Resolves a mock endpoint for the given project, HTTP method, and request path.
     *
     * <p>Uses a cache-aside pattern with project-scoped Redis cache:
     * <ol>
     *   <li>Check cache {@code "mock:{projectId}"} for key {@code "{METHOD}:{fullPath}"}</li>
     *   <li>On cache HIT → return {@link CachedMockResponse} directly</li>
     *   <li>On cache MISS → resolve via DB (exact match → AntPathMatcher) → cache → return</li>
     * </ol>
     *
     * <p>If Redis is unavailable, all cache operations are silently skipped
     * and the response is served directly from PostgreSQL.
     *
     * @param projectId the project UUID as a string
     * @param method    the HTTP method (GET, POST, etc.)
     * @param fullPath  the trailing request path (e.g. {@code /users/42})
     * @return the cached mock response
     * @throws MockNotFoundException    if no route matches
     * @throws IllegalArgumentException if {@code projectId} is not a valid UUID
     */
    public CachedMockResponse executeMock(String projectId, String method, String fullPath, String providedApiKey) {
        UUID uuid = UUID.fromString(projectId);
        String upperMethod = method.toUpperCase();

        // Hash the provided key. If none provided, use "NONE" to prevent cache collisions
        String providedHash = (providedApiKey != null && !providedApiKey.isBlank())
                ? com.devforge.util.ApiKeyUtil.sha256Hex(providedApiKey)
                : "NONE";

        String cacheKey = providedHash + ":" + upperMethod + ":" + fullPath;
        String cacheName = "mock:" + projectId;

        // 1. Try cache first using the hash-based key
        CachedMockResponse cached = tryGetFromCache(cacheName, cacheKey);
        if (cached != null) {
            return cached; // Zero DB hits!
        }

        // 2. Cache MISS — fetch project, validate key, and resolve mock from database
        CachedMockResponse response = resolveAndValidateFromDatabase(uuid, upperMethod, fullPath, providedHash);

        // 3. Store in cache using the hash-based key
        tryPutInCache(cacheName, cacheKey, response);

        return response;
    }

    private CachedMockResponse tryGetFromCache(String cacheName, String cacheKey) {
        try {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                return cache.get(cacheKey, CachedMockResponse.class);
            }
        } catch (Exception e) {
            log.warn("Redis cache GET failure: {} - falling back to database", e.getMessage());
        }
        return null;
    }

    private void tryPutInCache(String cacheName, String cacheKey, CachedMockResponse response) {
        try {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.put(cacheKey, response);
            }
        } catch (Exception e) {
            log.warn("Redis cache PUT failure: {} - data served but not cached", e.getMessage());
        }
    }

    private CachedMockResponse resolveAndValidateFromDatabase(UUID projectId, String method, String fullPath, String providedHash) {
        // Step A: Validate Project and API Key Hash
        com.devforge.entity.Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new com.devforge.exception.MockNotFoundException(method, fullPath));

        if (project.isRequireApiKey()) {
            if ("NONE".equals(providedHash) || !providedHash.equals(project.getApiKeyHash())) {
                throw new com.devforge.exception.InvalidApiKeyException();
            }
        }

        // Step B: Try exact match first (highest priority)
        Optional<MockEndpoint> exactMatch = mockEndpointRepository
                .findByProjectIdAndMethodAndPath(projectId, method, fullPath);

        if (exactMatch.isPresent()) {
            return toCache(exactMatch.get());
        }

        // Step C: Fall back to AntPathMatcher pattern matching
        List<MockEndpoint> candidates = mockEndpointRepository
                .findByProjectIdAndMethod(projectId, method);

        for (MockEndpoint candidate : candidates) {
            if (pathMatcher.match(candidate.getPath(), fullPath)) {
                return toCache(candidate);
            }
        }

        throw new MockNotFoundException(method, fullPath);
    }

    private CachedMockResponse toCache(MockEndpoint endpoint) {
        return CachedMockResponse.builder()
                .endpointId(endpoint.getId())
                .statusCode(endpoint.getStatusCode())
                .responseBody(endpoint.getResponseBody())
                .contentType(endpoint.getContentType())
                .delayMs(endpoint.getDelayMs())
                .build();
    }
}
