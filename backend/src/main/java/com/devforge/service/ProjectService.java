package com.devforge.service;

import com.devforge.dto.ProjectRequest;
import com.devforge.dto.ProjectResponse;
import com.devforge.entity.Project;
import com.devforge.entity.User;
import com.devforge.repository.MockRequestLogRepository;
import com.devforge.repository.ProjectRepository;
import com.devforge.repository.UserRepository;
import com.devforge.util.ApiKeyUtil;
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
                .map(p -> toResponse(p, null)) // Never expose key on list queries
                .collect(Collectors.toList());
    }

    public ProjectResponse createProject(ProjectRequest request, String username) {
        User user = findUserByUsername(username);

        // SAFELY EXTRACT THE BOOLEAN: Defaults to false if null
        boolean shouldRequireKey = request.getRequireApiKey() != null && request.getRequireApiKey();

        // Generate plaintext key and its SHA-256 hash
        String plaintextKey = ApiKeyUtil.generatePlaintextKey();
        String keyHash = ApiKeyUtil.sha256Hex(plaintextKey);

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .requireApiKey(shouldRequireKey)
                .apiKeyHash(keyHash)
                .owner(user)
                .build();

        Project saved = projectRepository.save(project);

        // Return plaintext key EXACTLY ONCE in the creation response
        return toResponse(saved, plaintextKey);
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

    @Transactional
    public ProjectResponse rotateProjectApiKey(UUID projectId, String username) {
        User user = findUserByUsername(username);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not own this project");
        }

        if (!project.isRequireApiKey()) {
            throw new IllegalArgumentException("This project does not require an API key");
        }

        // Generate new plaintext key and its SHA-256 hash
        String newPlaintextKey = ApiKeyUtil.generatePlaintextKey();
        String newKeyHash = ApiKeyUtil.sha256Hex(newPlaintextKey);

        project.setApiKeyHash(newKeyHash);
        Project saved = projectRepository.save(project);

        // Evict the old cache because the old hashed API key is no longer valid
        evictProjectCache(projectId);

        // Return plaintext key EXACTLY ONCE in the response
        return toResponse(saved, newPlaintextKey);
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

    /**
     * Maps a Project entity to a ProjectResponse.
     *
     * @param project      the project entity
     * @param plaintextKey if non-null, includes the one-time plaintext API key in the response
     */
    private ProjectResponse toResponse(Project project, String plaintextKey) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .description(project.getDescription())
                .ownerUsername(project.getOwner().getUsername())
                .apiKey(plaintextKey) // null on list/get, populated only on create
                .requireApiKey(project.isRequireApiKey())
                .createdAt(project.getCreatedAt())
                .build();
    }
}