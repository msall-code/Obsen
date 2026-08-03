package com.obsen.backend.modules.identity.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @Value("${keycloak.auth-server-url:http://localhost:7089/auth}")
    private String keycloakUrl;

    @Value("${keycloak.realm:Obsen-realm}")
    private String realm;

    @Value("${keycloak.resource:obsen-backend}")
    private String clientId;

    @Value("${keycloak.credentials.secret:}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        if (username == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username et password sont requis"));
        }

        String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> bodyParams = new LinkedMultiValueMap<>();
        bodyParams.add("grant_type", "password");
        bodyParams.add("client_id", clientId);
        if (clientSecret != null && !clientSecret.isBlank()) {
            bodyParams.add("client_secret", clientSecret);
        }
        bodyParams.add("username", username);
        bodyParams.add("password", password);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(bodyParams, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);
            return ResponseEntity.ok(response.getBody());
        } catch (HttpStatusCodeException e) {
            return ResponseEntity.status(e.getStatusCode()).body(Map.of(
                "error", "Échec de l'authentification Keycloak",
                "details", e.getResponseBodyAsString()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "Erreur serveur interne lors de la connexion",
                "details", e.getMessage()
            ));
        }
    }
}