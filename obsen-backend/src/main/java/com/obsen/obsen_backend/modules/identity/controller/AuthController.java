package com.obsen.obsen_backend.modules.identity.controller;

import com.obsen.obsen_backend.modules.identity.dto.request.LoginRequest;
import com.obsen.obsen_backend.modules.identity.dto.request.RefreshTokenRequest;
import com.obsen.obsen_backend.modules.identity.dto.request.RegisterRequest;
import com.obsen.obsen_backend.modules.identity.dto.response.AuthResponse;
import com.obsen.obsen_backend.modules.identity.dto.response.UserResponse;
import com.obsen.obsen_backend.modules.identity.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request));
    }
}