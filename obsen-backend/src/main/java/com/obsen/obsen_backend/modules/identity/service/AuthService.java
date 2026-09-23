package com.obsen.obsen_backend.modules.identity.service;

import com.obsen.obsen_backend.modules.identity.dto.request.LoginRequest;
import com.obsen.obsen_backend.modules.identity.dto.request.RefreshTokenRequest;
import com.obsen.obsen_backend.modules.identity.dto.request.RegisterRequest;
import com.obsen.obsen_backend.modules.identity.dto.response.AuthResponse;
import com.obsen.obsen_backend.modules.identity.dto.response.UserResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    UserResponse register(RegisterRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
}