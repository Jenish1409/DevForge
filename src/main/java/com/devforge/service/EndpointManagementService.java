package com.devforge.service;

import com.devforge.dto.EndpointRequest;
import com.devforge.dto.EndpointResponse;
import com.devforge.entity.MockEndpoint;
import com.devforge.entity.Project;
import com.devforge.entity.User;
import com.devforge.repository.MockEndpointRepository;
import com.devforge.repository.ProjectRepository;
import com.devforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EndpointManagementService {

    private final MockEndpointRepository mockEndpointRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<EndpointResponse> getEndpoints(UUID projectId, String username) {
        findProjectWithOwnershipCheck(projectId, username);
        return mockEndpointRepository.findByProjectId(projectId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public EndpointResponse createEndpoint(UUID projectId, EndpointRequest request, String username) {
        Project project = findProjectWithOwnershipCheck(projectId, username);

        MockEndpoint endpoint = MockEndpoint.builder()
                .project(project)
                .method(request.getMethod().toUpperCase())
                .path(request.getPath())
                .statusCode(request.getStatusCode())
                .responseBody(request.getResponseBody())
                .contentType(request.getContentType())
                .build();

        MockEndpoint saved = mockEndpointRepository.save(endpoint);
        return toResponse(saved);
    }

    public EndpointResponse updateEndpoint(UUID endpointId, EndpointRequest request, String username) {
        MockEndpoint endpoint = mockEndpointRepository.findById(endpointId)
                .orElseThrow(() -> new IllegalArgumentException("Endpoint not found: " + endpointId));

        // Verify ownership through the project chain
        verifyOwnership(endpoint.getProject(), username);

        endpoint.setMethod(request.getMethod().toUpperCase());
        endpoint.setPath(request.getPath());
        endpoint.setStatusCode(request.getStatusCode());
        endpoint.setResponseBody(request.getResponseBody());
        endpoint.setContentType(request.getContentType());

        MockEndpoint updated = mockEndpointRepository.save(endpoint);
        return toResponse(updated);
    }

    public void deleteEndpoint(UUID endpointId, String username) {
        MockEndpoint endpoint = mockEndpointRepository.findById(endpointId)
                .orElseThrow(() -> new IllegalArgumentException("Endpoint not found: " + endpointId));

        verifyOwnership(endpoint.getProject(), username);
        mockEndpointRepository.delete(endpoint);
    }

    private Project findProjectWithOwnershipCheck(UUID projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));
        verifyOwnership(project, username);
        return project;
    }

    private void verifyOwnership(Project project, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not own this project");
        }
    }

    private EndpointResponse toResponse(MockEndpoint endpoint) {
        return EndpointResponse.builder()
                .id(endpoint.getId())
                .method(endpoint.getMethod())
                .path(endpoint.getPath())
                .statusCode(endpoint.getStatusCode())
                .responseBody(endpoint.getResponseBody())
                .contentType(endpoint.getContentType())
                .createdAt(endpoint.getCreatedAt())
                .build();
    }
}
