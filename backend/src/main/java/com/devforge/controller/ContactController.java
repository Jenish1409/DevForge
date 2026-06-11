package com.devforge.controller;

import com.devforge.dto.ContactRequest;
import com.devforge.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
public class ContactController {

    private final EmailService emailService;

    @Value("${app.admin-email}")
    private String adminEmail;

    @PostMapping
    public ResponseEntity<Map<String, String>> submitContact(@RequestBody ContactRequest request) {
        if (request.getName() == null || request.getName().isBlank()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (request.getMessage() == null || request.getMessage().isBlank()) {
            throw new IllegalArgumentException("Message is required");
        }

        emailService.sendContactEmail(adminEmail, request.getName(), request.getEmail(), request.getMessage());

        return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
    }
}
