package com.obsen.backend.modules.identity.controller;

import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        
        // Simule une réponse OK pour débloquer le composant Login.jsx
        return ResponseEntity.ok(Map.of(
            "access_token", "mock-jwt-token-for-" + username,
            "token_type", "Bearer",
            "expires_in", 3600
        ));
    }
}