package com.devforge.service;

import com.devforge.dto.ProjectRequest;
import com.devforge.dto.ProjectResponse;
import com.devforge.entity.Project;
import com.devforge.entity.User;
import com.devforge.repository.ProjectRepository;
import com.devforge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public List<ProjectResponse> getProjectsByUser(String username) {
        User user = findUserByUsername(username);
        return projectRepository.findByOwnerId(user.getId())
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProjectResponse createProject(ProjectRequest request, String username) {
        User user = findUserByUsername(username);

        Project project = Project.builder()
                .name(request.getName())
                .description(request.getDescription())
                .requireApiKey(request.isRequireApiKey())
                .owner(user)
                .build();

        Project saved = projectRepository.save(project);
        return toResponse(saved);
    }

    public void deleteProject(UUID projectId, String username) {
        User user = findUserByUsername(username);
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found: " + projectId));

        if (!project.getOwner().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You do not own this project");
        }

        projectRepository.delete(project);
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
