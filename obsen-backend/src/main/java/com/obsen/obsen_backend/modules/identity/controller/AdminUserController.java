package com.obsen.obsen_backend.modules.identity.controller;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"}, allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AdminUserController {

    private final Keycloak keycloak;

    @Value("${keycloak.admin.realm}")
    private String realm;

    public AdminUserController(Keycloak keycloak) {
        this.keycloak = keycloak;
    }

    // --- GESTION DES UTILISATEURS ---

    // 1. Activer / Désactiver un compte utilisateur
    @PutMapping("/users/{userId}/status")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable String userId, @RequestParam boolean enabled) {
        UserRepresentation user = keycloak.realm(realm).users().get(userId).toRepresentation();
        user.setEnabled(enabled);
        keycloak.realm(realm).users().get(userId).update(user);
        return ResponseEntity.ok().build();
    }

    // 2. Supprimer un compte utilisateur
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        keycloak.realm(realm).users().get(userId).remove();
        return ResponseEntity.noContent().build();
    }

    // 3. Modifier le mot de passe d'un utilisateur
    @PutMapping("/users/{userId}/password")
    public ResponseEntity<Void> resetPassword(@PathVariable String userId, @RequestBody String newPassword) {
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(newPassword);
        credential.setTemporary(false);

        keycloak.realm(realm).users().get(userId).resetPassword(credential);
        return ResponseEntity.ok().build();
    }

    // 4. Mettre à jour les informations de l'utilisateur
    @PutMapping("/users/{userId}")
    public ResponseEntity<Void> updateUser(@PathVariable String userId, @RequestBody UserRepresentation updatedUser) {
        UserRepresentation user = keycloak.realm(realm).users().get(userId).toRepresentation();
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());
        user.setEmail(updatedUser.getEmail());

        keycloak.realm(realm).users().get(userId).update(user);
        return ResponseEntity.ok().build();
    }

    // --- GESTION DES RÔLES ---

    // 5. Lister tous les rôles du Realm
    @GetMapping("/roles")
    public ResponseEntity<List<RoleRepresentation>> getAllRoles() {
        return ResponseEntity.ok(keycloak.realm(realm).roles().list());
    }

    // 6. Créer un nouveau rôle
    @PostMapping("/roles")
    public ResponseEntity<Void> createRole(@RequestBody RoleRepresentation role) {
        keycloak.realm(realm).roles().create(role);
        return ResponseEntity.ok().build();
    }

    // 7. Modifier un rôle existant (Description / Nom)
    @PutMapping("/roles/{roleName}")
    public ResponseEntity<Void> updateRole(@PathVariable String roleName, @RequestBody RoleRepresentation updatedRole) {
        RoleRepresentation role = keycloak.realm(realm).roles().get(roleName).toRepresentation();
        if (updatedRole.getDescription() != null) {
            role.setDescription(updatedRole.getDescription());
        }
        if (updatedRole.getName() != null && !updatedRole.getName().equalsIgnoreCase(roleName)) {
            role.setName(updatedRole.getName());
        }
        keycloak.realm(realm).roles().get(roleName).update(role);
        return ResponseEntity.ok().build();
    }

    // 8. Supprimer un rôle
    @DeleteMapping("/roles/{roleName}")
    public ResponseEntity<Void> deleteRole(@PathVariable String roleName) {
        keycloak.realm(realm).roles().get(roleName).remove();
        return ResponseEntity.noContent().build();
    }

    // 9. Attribuer un rôle à un utilisateur
    @PostMapping("/users/{userId}/roles/{roleName}")
    public ResponseEntity<Void> assignRoleToUser(@PathVariable String userId, @PathVariable String roleName) {
        RoleRepresentation role = keycloak.realm(realm).roles().get(roleName).toRepresentation();
        keycloak.realm(realm).users().get(userId).roles().realmLevel().add(Collections.singletonList(role));
        return ResponseEntity.ok().build();
    }

    // 10. Retirer un rôle à un utilisateur
    @DeleteMapping("/users/{userId}/roles/{roleName}")
    public ResponseEntity<Void> removeRoleFromUser(@PathVariable String userId, @PathVariable String roleName) {
        RoleRepresentation role = keycloak.realm(realm).roles().get(roleName).toRepresentation();
        keycloak.realm(realm).users().get(userId).roles().realmLevel().remove(Collections.singletonList(role));
        return ResponseEntity.ok().build();
    }
}