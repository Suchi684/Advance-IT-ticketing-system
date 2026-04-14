package com.ticketing.system.controller;

import com.ticketing.system.model.dto.AuthResponse;
import com.ticketing.system.model.dto.LoginRequest;
import com.ticketing.system.model.dto.ResetPasswordRequest;
import com.ticketing.system.model.dto.SignupRequest;
import com.ticketing.system.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request.getEmail(), request.getNewPassword());
        return ResponseEntity.ok(Map.of("message", "Password reset successful"));
    }
}
