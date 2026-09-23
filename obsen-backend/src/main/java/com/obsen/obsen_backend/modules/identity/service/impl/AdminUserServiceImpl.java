package com.obsen.obsen_backend.modules.identity.service.impl;

import com.obsen.obsen_backend.modules.identity.dto.response.UserResponse;
import com.obsen.obsen_backend.modules.identity.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminUserServiceImpl implements AdminUserService {

    private final Keycloak keycloakAdminClient;

    @Value("${keycloak.realm}")
    private String realm;

    @Override
    public List<UserResponse> getAllUsers() {
        return keycloakAdminClient.realm(realm).users().list().stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(String userId) {
        UserRepresentation user = keycloakAdminClient.realm(realm).users().get(userId).toRepresentation();
        return mapToUserResponse(user);
    }

    @Override
    public void assignRoleToUser(String userId, String roleName) {
        UserResource userResource = keycloakAdminClient.realm(realm).users().get(userId);
        RoleRepresentation role = keycloakAdminClient.realm(realm).roles().get(roleName).toRepresentation();
        userResource.roles().realmLevel().add(Collections.singletonList(role));
    }

    @Override
    public void toggleUserStatus(String userId, boolean enabled) {
        UserResource userResource = keycloakAdminClient.realm(realm).users().get(userId);
        UserRepresentation user = userResource.toRepresentation();
        user.setEnabled(enabled);
        userResource.update(user);
    }

    @Override
    public void deleteUser(String userId) {
        keycloakAdminClient.realm(realm).users().delete(userId);
    }

    private UserResponse mapToUserResponse(UserRepresentation user) {
        List<String> roles = keycloakAdminClient.realm(realm).users().get(user.getId())
                .roles().realmLevel().listAll().stream()
                .map(role -> role.getName())
                .toList();

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .enabled(Boolean.TRUE.equals(user.isEnabled()))
                .roles(roles)
                .build();
    }
}