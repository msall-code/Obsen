package com.obsen.backend.modules.identity.controller;

import java.util.Map;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/identity")
public class UserController {

    // 👤 Accessible par tout utilisateur authentifié
    @GetMapping("/me")
    public Map<String, Object> getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        return Map.of(
            "id", jwt.getSubject(),
            "username", jwt.getClaimAsString("preferred_username"),
            "email", jwt.getClaimAsString("email")
        );
    }

    // 👑 Accessible UNIQUEMENT par les administrateurs
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('admin')")
    public String getAdminDashboard() {
        return "Bienvenue dans l'espace de gestion des utilisateurs !";
    }
}