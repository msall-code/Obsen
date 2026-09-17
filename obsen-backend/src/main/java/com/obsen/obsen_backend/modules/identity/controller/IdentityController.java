package com.obsen.obsen_backend.modules.identity.controller;

import java.time.Instant;
import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.obsen.obsen_backend.modules.identity.dto.UpdateRolesRequest;
import com.obsen.obsen_backend.modules.identity.dto.UserRequestDto;
import com.obsen.obsen_backend.modules.identity.dto.UserResponseDto;
import com.obsen.obsen_backend.modules.identity.service.IdentityService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/identity")
@RequiredArgsConstructor
@Tag(name = "Identity Module", description = "Gestion du profil et de l'identité utilisateur")
public class IdentityController {

    private final IdentityService identityService;

    @GetMapping("/me")
    @Operation(summary = "Récupérer et synchroniser le profil de l'utilisateur connecté")
    @PreAuthorize("isAuthenticated()")
    @SuppressWarnings("java:S4449")
    public ResponseEntity<UserResponseDto> getCurrentUser(@AuthenticationPrincipal Object principal) {
        if (principal instanceof OidcUser oidcUser) {
            Instant issuedAt = Objects.requireNonNullElseGet(oidcUser.getIdToken().getIssuedAt(), Instant::now);
            Instant expiresAt = Objects.requireNonNullElseGet(oidcUser.getIdToken().getExpiresAt(), () -> Instant.now().plusSeconds(3600));
            Jwt jwt = Jwt.withTokenValue(oidcUser.getIdToken().getTokenValue())
                    .issuedAt(issuedAt)
                    .expiresAt(expiresAt)
                    .claims(claims -> claims.putAll(oidcUser.getIdToken().getClaims()))
                    .build();
            return ResponseEntity.ok(identityService.syncAndGetCurrentUser(jwt));
        } else if (principal instanceof Jwt jwt) {
            return ResponseEntity.ok(identityService.syncAndGetCurrentUser(jwt));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/users")
    @Operation(summary = "Lister tous les utilisateurs (Admin)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(identityService.getAllUsers());
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "Mettre à jour un utilisateur (Nom, Prénom, Email)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUser(@PathVariable("id") String id, @RequestBody UserRequestDto dto) {
        identityService.updateUser(id, dto);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Activer ou désactiver (bloquer) un utilisateur")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> toggleUserStatus(@PathVariable("id") String id, @RequestParam("enabled") boolean enabled) {
        identityService.toggleUserStatus(id, enabled);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/users/{id}/roles")
    @Operation(summary = "Mettre à jour les rôles d'un utilisateur")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> updateUserRoles(@PathVariable("id") String id, @RequestBody UpdateRolesRequest request) {
        identityService.updateUserRoles(id, request);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprimer un utilisateur")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") String id) {
        identityService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}