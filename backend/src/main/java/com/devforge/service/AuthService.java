package com.devforge.service;

import com.devforge.dto.AuthResponse;
import com.devforge.dto.LoginRequest;
import com.devforge.dto.OtpInitRequest;
import com.devforge.dto.OtpVerifyRequest;
import com.devforge.entity.User;
import com.devforge.repository.UserRepository;
import com.devforge.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final EmailService emailService;

    private static final Pattern HAS_DIGIT = Pattern.compile(".*\\d.*");

    /**
     * Step 1: Validate inputs, generate OTP, send email.
     */
    public void initRegistration(OtpInitRequest request) {
        // Password strength validation
        if (request.getPassword() == null || request.getPassword().length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
        if (!HAS_DIGIT.matcher(request.getPassword()).matches()) {
            throw new IllegalArgumentException("Password must contain at least 1 digit");
        }

        // Uniqueness validation
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already taken: " + request.getUsername());
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        // Generate OTP (rate-limited internally) and send email
        String otp = otpService.generateAndStore(request.getEmail());
        emailService.sendOtpEmail(request.getEmail(), otp);
    }

    /**
     * Step 2: Validate OTP, create user, return JWT.
     */
    public AuthResponse verifyRegistration(OtpVerifyRequest request) {
        // Validate OTP
        boolean valid = otpService.validateAndConsume(request.getEmail(), request.getOtp());
        if (!valid) {
            throw new IllegalArgumentException("Invalid or expired OTP");
        }

        // Re-check uniqueness (another user could have registered between init and verify)
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already taken: " + request.getUsername());
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        // Create and save user
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }
}
