package com.devforge.controller;

import com.devforge.dto.MonitoredApiRequest;
import com.devforge.service.ApiMonitoringService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for the API monitoring feature (ported from ApiSentinel).
 * All endpoints are under /api/v1/monitoring and require JWT authentication.
 */
@RestController
@RequestMapping("/api/v1/monitoring")
@RequiredArgsConstructor
public class ApiMonitoringController {

    private final ApiMonitoringService monitoringService;

    @PostMapping
    public ResponseEntity<?> registerApi(@Valid @RequestBody MonitoredApiRequest request,
                                         @AuthenticationPrincipal UserDetails user) {
        try {
            monitoringService.createApi(request, user.getUsername());
            return ResponseEntity.ok(Map.of("success", true,
                    "message", "API registered for monitoring successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserApis(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(Map.of("success", true,
                "message", "APIs fetched successfully",
                "data", monitoringService.getUserApis(user.getUsername())));
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getDashboardSummary(@AuthenticationPrincipal UserDetails user) {
        try {
            return ResponseEntity.ok(Map.of("success", true,
                    "message", "Dashboard summary fetched successfully",
                    "data", monitoringService.getDashboardSummary(user.getUsername())));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getApiDetails(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails user) {
        try {
            return ResponseEntity.ok(Map.of("success", true,
                    "message", "Details fetched",
                    "data", monitoringService.getApiDetails(id, user.getUsername())));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<?> getApiHistory(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetails user) {
        try {
            return ResponseEntity.ok(Map.of("success", true,
                    "message", "History fetched",
                    "data", monitoringService.getApiHistory(id, user.getUsername())));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @GetMapping("/{id}/incidents")
    public ResponseEntity<?> getApiIncidents(@PathVariable Long id,
                                              @AuthenticationPrincipal UserDetails user) {
        try {
            return ResponseEntity.ok(Map.of("success", true,
                    "message", "Incidents fetched",
                    "data", monitoringService.getApiIncidents(id, user.getUsername())));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateApi(@PathVariable Long id,
                                       @Valid @RequestBody MonitoredApiRequest request,
                                       @AuthenticationPrincipal UserDetails user) {
        try {
            monitoringService.updateApi(id, request, user.getUsername());
            return ResponseEntity.ok(Map.of("success", true,
                    "message", "API updated successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApi(@PathVariable Long id,
                                       @AuthenticationPrincipal UserDetails user) {
        try {
            monitoringService.deleteApi(id, user.getUsername());
            return ResponseEntity.ok(Map.of("success", true,
                    "message", "API deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<?> toggleApi(@PathVariable Long id,
                                       @AuthenticationPrincipal UserDetails user) {
        try {
            monitoringService.toggleApi(id, user.getUsername());
            return ResponseEntity.ok(Map.of("success", true,
                    "message", "API monitoring toggled successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
