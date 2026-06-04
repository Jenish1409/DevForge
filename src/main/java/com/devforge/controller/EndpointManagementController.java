package com.devforge.controller;

import com.devforge.dto.EndpointRequest;
import com.devforge.dto.EndpointResponse;
import com.devforge.service.EndpointManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects/{projectId}/endpoints")
@RequiredArgsConstructor
public class EndpointManagementController {

    private final EndpointManagementService endpointManagementService;

    @GetMapping
    public ResponseEntity<List<EndpointResponse>> getEndpoints(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<EndpointResponse> endpoints = endpointManagementService
                .getEndpoints(projectId, userDetails.getUsername());
        return ResponseEntity.ok(endpoints);
    }

    @PostMapping
    public ResponseEntity<EndpointResponse> createEndpoint(
            @PathVariable UUID projectId,
            @RequestBody EndpointRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        EndpointResponse endpoint = endpointManagementService
                .createEndpoint(projectId, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(endpoint);
    }

    @PutMapping("/{endpointId}")
    public ResponseEntity<EndpointResponse> updateEndpoint(
            @PathVariable UUID projectId,
            @PathVariable UUID endpointId,
            @RequestBody EndpointRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        EndpointResponse endpoint = endpointManagementService
                .updateEndpoint(endpointId, request, userDetails.getUsername());
        return ResponseEntity.ok(endpoint);
    }

    @DeleteMapping("/{endpointId}")
    public ResponseEntity<Void> deleteEndpoint(
            @PathVariable UUID projectId,
            @PathVariable UUID endpointId,
            @AuthenticationPrincipal UserDetails userDetails) {
        endpointManagementService.deleteEndpoint(endpointId, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
