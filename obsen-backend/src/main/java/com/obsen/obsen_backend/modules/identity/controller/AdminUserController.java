package com.obsen.obsen_backend.modules.identity.controller;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final Keycloak keycloak;

    @Value("${keycloak.admin.realm}")
    private String realm;

    public AdminUserController(Keycloak keycloak) {
        this.keycloak = keycloak;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserRepresentation>> getUsers() {
        return ResponseEntity.ok(keycloak.realm(realm).users().list());
    }

    // Endpoint de création d'utilisateur
    @PostMapping("/users")
    public ResponseEntity<Void> createUser(@RequestBody UserRepresentation user) {
        user.setEnabled(true);
        keycloak.realm(realm).users().create(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Adapté pour accepter PUT /status?enabled=true|false
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable String userId, @RequestParam boolean enabled) {
        UserRepresentation user = keycloak.realm(realm).users().get(userId).toRepresentation();
        user.setEnabled(enabled);
        keycloak.realm(realm).users().get(userId).update(user);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        keycloak.realm(realm).users().get(userId).remove();
        return ResponseEntity.noContent().build();
    }

    // Adapté pour lire le payload JSON { "password": "..." }
    @PutMapping("/users/{userId}/password")
    public ResponseEntity<Void> resetPassword(@PathVariable String userId, @RequestBody Map<String, String> payload) {
        String newPassword = payload.get("password");
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(newPassword);
        credential.setTemporary(false);

        keycloak.realm(realm).users().get(userId).resetPassword(credential);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<Void> updateUser(@PathVariable String userId, @RequestBody UserRepresentation updatedUser) {
        UserRepresentation user = keycloak.realm(realm).users().get(userId).toRepresentation();
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());

        keycloak.realm(realm).users().get(userId).update(user);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/roles")
    public ResponseEntity<List<RoleRepresentation>> getAllRoles() {
        try {
            List<RoleRepresentation> roles = keycloak.realm(realm).roles().list();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            // Affiche la vraie cause de l'erreur dans la console backend Spring Boot
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/roles")
    public ResponseEntity<Void> createRole(@RequestBody RoleRepresentation role) {
        keycloak.realm(realm).roles().create(role);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/roles/{roleName}")
    public ResponseEntity<Void> deleteRole(@PathVariable String roleName) {
        keycloak.realm(realm).roles().get(roleName).remove();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/users/{userId}/roles/{roleName}")
    public ResponseEntity<Void> assignRoleToUser(@PathVariable String userId, @PathVariable String roleName) {
        RoleRepresentation role = keycloak.realm(realm).roles().get(roleName).toRepresentation();
        keycloak.realm(realm).users().get(userId).roles().realmLevel().add(Collections.singletonList(role));
        return ResponseEntity.ok().build();
    }
}