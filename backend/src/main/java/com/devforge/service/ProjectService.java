package com.devforge.service;

import com.devforge.dto.ProjectRequest;
import com.devforge.dto.ProjectResponse;
import com.devforge.entity.Project;
import com.devforge.entity.User;
import com.devforge.repository.MockRequestLogRepository;
import com.devforge.repository.ProjectRepository;
import com.devforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final MockRequestLogRepository mockRequestLogRepository;
    private final CacheManager cacheManager;

    public List<ProjectResponse> getProjectsByUser(String username) {
        User user = findUserByUsername(username);
        return projectRepository.findByOwnerId(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse createProject(ProjectRequest request, String username) {
        User user = findUserByUsername(username);

        // SAFELY EXTRACT THE BOOLEAN: Defaults to false if null
        boolean shouldRequireKey = request.getRequireApiKey() != null && request.getRequireApiKey();

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .requireApiKey(shouldRequireKey) // Pass the safe primitive boolean here
                .owner(user)
                .build();

        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    @Transactional
    public void deleteProject(UUID projectId, String username) {
        User user = findUserByUsername(username);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not own this project");
        }

        // 1. Delete request logs (no FK cascade from mock_request_logs → projects)
        mockRequestLogRepository.deleteByProjectId(projectId);

        // 2. Delete project (cascades to mock_endpoints via JPA)
        projectRepository.delete(project);

        // 3. Evict Redis cache for this project
        evictProjectCache(projectId);
    }

    private void evictProjectCache(UUID projectId) {
        try {
            Cache cache = cacheManager.getCache("mock:" + projectId);
            if (cache != null) {
                cache.clear();
            }
        } catch (Exception e) {
            log.warn("Redis cache EVICT failure on project delete: {}", e.getMessage());
        }
    }

    private User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
    }

    private ProjectResponse toResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .ownerUsername(project.getOwner().getUsername())
                .apiKey(project.getApiKey())
                .requireApiKey(project.isRequireApiKey())
                .createdAt(project.getCreatedAt())
                .build();
    }
}