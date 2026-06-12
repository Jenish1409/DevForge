package com.devforge.controller;

import com.devforge.dto.ProjectRequest;
import com.devforge.dto.ProjectResponse;
import com.devforge.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<ProjectResponse> projects = projectService.getProjectsByUser(userDetails.getUsername());
        return ResponseEntity.ok(projects);
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ProjectResponse project = projectService.createProject(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(project);
    }

    @PostMapping("/{projectId}/rotate-key")
    public ResponseEntity<ProjectResponse> rotateKey(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        ProjectResponse project = projectService.rotateProjectApiKey(projectId, userDetails.getUsername());
        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        projectService.deleteProject(projectId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
