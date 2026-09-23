package com.obsen.obsen_backend.modules.identity.service.impl;

import java.net.URI;
import java.util.Collections;
import java.util.Objects;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.obsen.obsen_backend.modules.identity.dto.request.LoginRequest;
import com.obsen.obsen_backend.modules.identity.dto.request.RefreshTokenRequest;
import com.obsen.obsen_backend.modules.identity.dto.request.RegisterRequest;
import com.obsen.obsen_backend.modules.identity.dto.response.AuthResponse;
import com.obsen.obsen_backend.modules.identity.dto.response.UserResponse;
import com.obsen.obsen_backend.modules.identity.service.AuthService;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final Keycloak keycloakAdminClient;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    @Override
    @SuppressWarnings("null")
    public AuthResponse login(LoginRequest request) {
        String tokenEndpoint = String.format("%s/realms/%s/protocol/openid-connect/token", serverUrl, realm);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String username = Objects.requireNonNull(request.getUsername(), "Username ne peut pas être nul");
        String password = Objects.requireNonNull(request.getPassword(), "Password ne peut pas être nul");

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "password");
        map.add("client_id", Objects.requireNonNull(clientId));
        map.add("client_secret", Objects.requireNonNull(clientSecret));
        map.add("username", username);
        map.add("password", password);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(tokenEndpoint, entity, AuthResponse.class);

        AuthResponse authResponseBody = response.getBody();
        if (authResponseBody == null) {
            throw new IllegalStateException("Le corps de la réponse d'authentification est vide");
        }

        return authResponseBody;
    }

    @Override
    public UserResponse register(RegisterRequest request) {
        UsersResource usersResource = keycloakAdminClient.realm(realm).users();

        UserRepresentation user = new UserRepresentation();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEnabled(true);
        user.setEmailVerified(true);

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(request.getPassword());
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));

        try (Response response = usersResource.create(user)) {
            if (response.getStatus() != 201) {
                throw new IllegalStateException("Échec de la création de l'utilisateur : Status " + response.getStatus());
            }

            URI location = response.getLocation();
            if (location == null || location.getPath() == null) {
                throw new IllegalStateException("En-tête Location absent dans la réponse Keycloak");
            }

            String path = location.getPath();
            String userId = path.substring(path.lastIndexOf('/') + 1);

            return UserResponse.builder()
                    .id(userId)
                    .username(request.getUsername())
                    .email(request.getEmail())
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .enabled(true)
                    .build();
        }
    }

    @Override
    @SuppressWarnings("null")
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String tokenEndpoint = String.format("%s/realms/%s/protocol/openid-connect/token", serverUrl, realm);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String refreshToken = Objects.requireNonNull(request.getRefreshToken(), "Refresh token ne peut pas être nul");

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "refresh_token");
        map.add("client_id", Objects.requireNonNull(clientId));
        map.add("client_secret", Objects.requireNonNull(clientSecret));
        map.add("refresh_token", refreshToken);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);
        ResponseEntity<AuthResponse> response = restTemplate.postForEntity(tokenEndpoint, entity, AuthResponse.class);

        AuthResponse authResponseBody = response.getBody();
        if (authResponseBody == null) {
            throw new IllegalStateException("Le corps de la réponse du rafraîchissement de token est vide");
        }

        return authResponseBody;
    }
}