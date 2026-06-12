package com.devforge.controller;

import com.devforge.dto.AuthResponse;
import com.devforge.dto.LoginRequest;
import com.devforge.dto.OtpInitRequest;
import com.devforge.dto.OtpVerifyRequest;
import com.devforge.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register/init")
    public ResponseEntity<Map<String, String>> registerInit(@Valid @RequestBody OtpInitRequest request) {
        authService.initRegistration(request);
        return ResponseEntity.ok(Map.of("message", "OTP sent to " + request.getEmail()));
    }

    @PostMapping("/register/verify")
    public ResponseEntity<AuthResponse> registerVerify(@Valid @RequestBody OtpVerifyRequest request) {
        AuthResponse response = authService.verifyRegistration(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
