package com.devforge.service;

import com.devforge.dto.CachedMockResponse;
import com.devforge.entity.MockEndpoint;
import com.devforge.entity.Project;
import com.devforge.exception.MockNotFoundException;
import com.devforge.repository.MockEndpointRepository;
import com.devforge.repository.ProjectRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MockEndpointServiceTest {

    @Mock
    private MockEndpointRepository mockEndpointRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private CacheManager cacheManager;

    @Mock
    private Cache cache;

    @InjectMocks
    private MockEndpointService mockEndpointService;

    private final UUID projectId = UUID.randomUUID();
    private final String projectIdStr = projectId.toString();

    private Project createMockProject(boolean requireApiKey) {
        return Project.builder()
                .id(projectId)
                .requireApiKey(requireApiKey)
                .apiKeyHash("dummyhash")
                .build();
    }

    @Test
    @DisplayName("Exact path match returns correct mock response from database")
    void exactPathMatch_returnsMockResponse() {
        MockEndpoint endpoint = MockEndpoint.builder()
                .id(UUID.randomUUID())
                .method("GET")
                .path("/users")
                .statusCode(200)
                .responseBody("[{\"id\": 1, \"name\": \"Test\"}]")
                .contentType("application/json")
                .delayMs(0)
                .build();

        // Cache returns null (miss)
        when(cacheManager.getCache("mock:" + projectIdStr)).thenReturn(cache);
        when(cache.get("NONE:GET:/users", CachedMockResponse.class)).thenReturn(null);

        // Project lookup succeeds
        when(projectRepository.findById(projectId)).thenReturn(Optional.of(createMockProject(false)));

        // DB returns exact match
        when(mockEndpointRepository.findByProjectIdAndMethodAndPath(projectId, "GET", "/users"))
                .thenReturn(Optional.of(endpoint));

        CachedMockResponse result = mockEndpointService.executeMock(projectIdStr, "GET", "/users", null);

        assertNotNull(result);
        assertEquals(200, result.getStatusCode());
        assertEquals("[{\"id\": 1, \"name\": \"Test\"}]", result.getResponseBody());
        assertEquals("application/json", result.getContentType());

        // Verify it was cached
        verify(cache).put(eq("NONE:GET:/users"), any(CachedMockResponse.class));
    }

    @Test
    @DisplayName("AntPathMatcher fallback resolves pattern routes like /users/{id}")
    void antPathMatcher_resolvesPatternRoute() {
        MockEndpoint patternEndpoint = MockEndpoint.builder()
                .id(UUID.randomUUID())
                .method("GET")
                .path("/users/{id}")
                .statusCode(200)
                .responseBody("{\"id\": 42, \"name\": \"Matched\"}")
                .contentType("application/json")
                .delayMs(0)
                .build();

        when(cacheManager.getCache("mock:" + projectIdStr)).thenReturn(cache);
        when(cache.get("NONE:GET:/users/42", CachedMockResponse.class)).thenReturn(null);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(createMockProject(false)));

        // Exact match fails
        when(mockEndpointRepository.findByProjectIdAndMethodAndPath(projectId, "GET", "/users/42"))
                .thenReturn(Optional.empty());

        // AntPathMatcher candidates returned
        when(mockEndpointRepository.findByProjectIdAndMethod(projectId, "GET"))
                .thenReturn(List.of(patternEndpoint));

        CachedMockResponse result = mockEndpointService.executeMock(projectIdStr, "GET", "/users/42", "");

        assertNotNull(result);
        assertEquals("{\"id\": 42, \"name\": \"Matched\"}", result.getResponseBody());
    }

    @Test
    @DisplayName("MockNotFoundException thrown when no route matches")
    void noRouteMatch_throwsMockNotFoundException() {
        when(cacheManager.getCache("mock:" + projectIdStr)).thenReturn(cache);
        when(cache.get("NONE:DELETE:/nonexistent", CachedMockResponse.class)).thenReturn(null);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(createMockProject(false)));

        when(mockEndpointRepository.findByProjectIdAndMethodAndPath(projectId, "DELETE", "/nonexistent"))
                .thenReturn(Optional.empty());
        when(mockEndpointRepository.findByProjectIdAndMethod(projectId, "DELETE"))
                .thenReturn(List.of());

        assertThrows(MockNotFoundException.class,
                () -> mockEndpointService.executeMock(projectIdStr, "DELETE", "/nonexistent", null));
    }

    @Test
    @DisplayName("Cache hit returns response directly without touching database")
    void cacheHit_returnsWithoutDbQuery() {
        CachedMockResponse cached = CachedMockResponse.builder()
                .endpointId(UUID.randomUUID())
                .statusCode(200)
                .responseBody("{\"cached\": true}")
                .contentType("application/json")
                .delayMs(0)
                .build();

        when(cacheManager.getCache("mock:" + projectIdStr)).thenReturn(cache);
        when(cache.get("NONE:GET:/users", CachedMockResponse.class)).thenReturn(cached);

        CachedMockResponse result = mockEndpointService.executeMock(projectIdStr, "GET", "/users", null);

        assertEquals("{\"cached\": true}", result.getResponseBody());

        // DB should NEVER be called on a cache hit
        verifyNoInteractions(mockEndpointRepository, projectRepository);
    }

    @Test
    @DisplayName("Redis connection failure falls back to PostgreSQL gracefully")
    void redisFails_fallsBackToPostgres() {
        MockEndpoint endpoint = MockEndpoint.builder()
                .id(UUID.randomUUID())
                .method("GET")
                .path("/users")
                .statusCode(200)
                .responseBody("[{\"id\": 1}]")
                .contentType("application/json")
                .delayMs(0)
                .build();

        // Simulate Redis connection failure on GET
        when(cacheManager.getCache("mock:" + projectIdStr))
                .thenThrow(new RuntimeException("Redis connection refused: Connection reset by peer"));

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(createMockProject(false)));

        // DB fallback works
        when(mockEndpointRepository.findByProjectIdAndMethodAndPath(projectId, "GET", "/users"))
                .thenReturn(Optional.of(endpoint));

        // Should NOT throw — must fall back to database
        CachedMockResponse result = assertDoesNotThrow(
                () -> mockEndpointService.executeMock(projectIdStr, "GET", "/users", null),
                "Service should gracefully fall back to PostgreSQL when Redis is unavailable"
        );

        assertNotNull(result);
        assertEquals(200, result.getStatusCode());
        assertEquals("[{\"id\": 1}]", result.getResponseBody());
    }

    @Test
    @DisplayName("Redis failure on cache PUT does not crash — data still returned")
    void redisPutFailure_dataStillReturned() {
        MockEndpoint endpoint = MockEndpoint.builder()
                .id(UUID.randomUUID())
                .method("POST")
                .path("/orders")
                .statusCode(201)
                .responseBody("{\"orderId\": 99}")
                .contentType("application/json")
                .delayMs(0)
                .build();

        Cache failingCache = mock(Cache.class);

        // Cache GET returns null (miss)
        when(cacheManager.getCache("mock:" + projectIdStr)).thenReturn(failingCache);
        when(failingCache.get("NONE:POST:/orders", CachedMockResponse.class)).thenReturn(null);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(createMockProject(false)));

        // DB returns data
        when(mockEndpointRepository.findByProjectIdAndMethodAndPath(projectId, "POST", "/orders"))
                .thenReturn(Optional.of(endpoint));

        // Cache PUT throws (simulating Redis write failure)
        doThrow(new RuntimeException("Redis WRITE timeout"))
                .when(failingCache).put(eq("NONE:POST:/orders"), any(CachedMockResponse.class));

        // Should NOT throw — data served from DB despite cache write failure
        CachedMockResponse result = assertDoesNotThrow(
                () -> mockEndpointService.executeMock(projectIdStr, "POST", "/orders", ""),
                "Service should return data even when Redis cache write fails"
        );

        assertNotNull(result);
        assertEquals(201, result.getStatusCode());
        assertEquals("{\"orderId\": 99}", result.getResponseBody());
    }
}
