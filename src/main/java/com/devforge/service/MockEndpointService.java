package com.devforge.service;

import com.devforge.entity.MockEndpoint;
import com.devforge.exception.MockNotFoundException;
import com.devforge.repository.MockEndpointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.AntPathMatcher;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MockEndpointService {

    private final MockEndpointRepository mockEndpointRepository;

    private final AntPathMatcher pathMatcher = new AntPathMatcher();

    /**
     * Resolves a mock endpoint for the given project, HTTP method, and request path.
     *
     * <p>Resolution order:
     * <ol>
     *   <li>Exact path match (e.g. {@code /users/admin})</li>
     *   <li>Pattern match via {@link AntPathMatcher} (e.g. {@code /users/{id}})</li>
     * </ol>
     *
     * @param projectId the project UUID as a string
     * @param method    the HTTP method (GET, POST, etc.)
     * @param fullPath  the trailing request path (e.g. {@code /users/42})
     * @return the matched {@link MockEndpoint}
     * @throws MockNotFoundException    if no route matches
     * @throws IllegalArgumentException if {@code projectId} is not a valid UUID
     */
    public MockEndpoint executeMock(String projectId, String method, String fullPath) {
        UUID uuid = UUID.fromString(projectId);
        String upperMethod = method.toUpperCase();

        // 1. Try exact match first (highest priority)
        Optional<MockEndpoint> exactMatch = mockEndpointRepository
                .findByProjectIdAndMethodAndPath(uuid, upperMethod, fullPath);

        if (exactMatch.isPresent()) {
            return exactMatch.get();
        }

        // 2. Fall back to AntPathMatcher pattern matching
        List<MockEndpoint> candidates = mockEndpointRepository
                .findByProjectIdAndMethod(uuid, upperMethod);

        for (MockEndpoint candidate : candidates) {
            if (pathMatcher.match(candidate.getPath(), fullPath)) {
                return candidate;
            }
        }

        throw new MockNotFoundException(upperMethod, fullPath);
    }
}
