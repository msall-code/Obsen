package com.obsen.obsen_backend.modules.identity.service;

import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.obsen.obsen_backend.modules.identity.dto.UpdateRolesRequest;
import com.obsen.obsen_backend.modules.identity.dto.UserRequestDto;
import com.obsen.obsen_backend.modules.identity.dto.UserResponseDto;
import com.obsen.obsen_backend.modules.identity.model.User;
import com.obsen.obsen_backend.modules.identity.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class IdentityService {

    private static final Set<String> IGNORED_SYSTEM_ROLES = Set.of(
            "offline_access", 
            "uma_authorization", 
            "default-roles-obsen-realm"
    );

    private final UserRepository userRepository;
    private final Keycloak keycloak;

    @Value("${keycloak.realm:Obsen-Realm}")
    private String realm;

    @Transactional
    public UserResponseDto syncAndGetCurrentUser(Jwt jwt) {
        String keycloakId = jwt.getSubject();

        if (keycloakId == null || keycloakId.isBlank()) {
            throw new IllegalArgumentException("Le token JWT ne contient pas d'identifiant valide (subject)");
        }

        String email = jwt.getClaimAsString("email");
        String username = jwt.getClaimAsString("preferred_username");
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");

        User user = userRepository.findById(keycloakId)
                .map(existingUser -> updateExistingUser(existingUser, email, firstName, lastName))
                .orElseGet(() -> createNewUser(keycloakId, username, email, firstName, lastName));

        return mapToDto(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponseDto> getAllUsers() {
        try {
            List<UserRepresentation> keycloakUsers = keycloak.realm(realm).users().list();

            return keycloakUsers.stream().map(kcUser -> {
                List<String> roles = fetchFilteredRoles(kcUser.getId());

                Instant createdAt = kcUser.getCreatedTimestamp() != null 
                        ? Instant.ofEpochMilli(kcUser.getCreatedTimestamp()) 
                        : Instant.now();

                return UserResponseDto.builder()
                        .keycloakId(kcUser.getId())
                        .username(kcUser.getUsername())
                        .email(kcUser.getEmail())
                        .firstName(kcUser.getFirstName())
                        .lastName(kcUser.getLastName())
                        .active(Boolean.TRUE.equals(kcUser.isEnabled()))
                        .createdAt(createdAt)
                        .roles(roles)
                        .build();
            }).toList();

        } catch (Exception e) {
            log.error("Erreur lors de la récupération des utilisateurs via Keycloak Admin API.", e);
            return userRepository.findAll().stream()
                    .map(this::mapToDto)
                    .toList();
        }
    }

    @Transactional
    public void updateUser(String keycloakId, UserRequestDto dto) {
        updateKeycloakUser(keycloakId, dto);
        updateLocalDatabaseUser(keycloakId, dto);
    }

    private void updateKeycloakUser(String keycloakId, UserRequestDto dto) {
        try {
            UserResource userResource = keycloak.realm(realm).users().get(keycloakId);
            UserRepresentation kcUser = userResource.toRepresentation();

            if (dto.getFirstName() != null) kcUser.setFirstName(dto.getFirstName());
            if (dto.getLastName() != null) kcUser.setLastName(dto.getLastName());
            if (dto.getEmail() != null) kcUser.setEmail(dto.getEmail());
            if (dto.getUsername() != null && !dto.getUsername().isBlank()) {
                kcUser.setUsername(dto.getUsername());
            }

            userResource.update(kcUser);

            if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
                CredentialRepresentation credential = new CredentialRepresentation();
                credential.setType(CredentialRepresentation.PASSWORD);
                credential.setValue(dto.getPassword());
                credential.setTemporary(false);
                userResource.resetPassword(credential);
            }
        } catch (Exception e) {
            log.error("Erreur lors de la mise à jour Keycloak pour l'utilisateur {}", keycloakId, e);
        }
    }

    private void updateLocalDatabaseUser(String keycloakId, UserRequestDto dto) {
        userRepository.findById(keycloakId).ifPresent(user -> {
            if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
            if (dto.getLastName() != null) user.setLastName(dto.getLastName());
            if (dto.getEmail() != null) user.setEmail(dto.getEmail());
            if (dto.getUsername() != null && !dto.getUsername().isBlank()) {
                user.setUsername(dto.getUsername());
            }
            userRepository.save(user);
        });
    }

    @Transactional
    public void toggleUserStatus(String keycloakId, boolean enabled) {
        try {
            UserResource userResource = keycloak.realm(realm).users().get(keycloakId);
            UserRepresentation kcUser = userResource.toRepresentation();
            kcUser.setEnabled(enabled);
            userResource.update(kcUser);
        } catch (Exception e) {
            log.error("Erreur lors du changement de statut Keycloak pour l'utilisateur {}", keycloakId, e);
        }

        userRepository.findById(keycloakId).ifPresent(user -> {
            user.setActive(enabled);
            userRepository.save(user);
        });
    }

    @Transactional
    public void updateUserRoles(String keycloakId, UpdateRolesRequest request) {
        UserResource userResource = keycloak.realm(realm).users().get(keycloakId);

        List<RoleRepresentation> allRealmRoles = keycloak.realm(realm).roles().list();

        List<RoleRepresentation> currentAssignedRoles = userResource.roles().realmLevel().listAll();
        List<RoleRepresentation> rolesToRemove = currentAssignedRoles.stream()
                .filter(role -> role != null && !IGNORED_SYSTEM_ROLES.contains(role.getName()))
                .toList();

        if (!rolesToRemove.isEmpty()) {
            userResource.roles().realmLevel().remove(rolesToRemove);
        }

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            List<RoleRepresentation> rolesToAssign = allRealmRoles.stream()
                    .filter(role -> role != null && request.getRoles().stream()
                            .anyMatch(reqRole -> reqRole.equalsIgnoreCase(role.getName())))
                    .toList();

            if (!rolesToAssign.isEmpty()) {
                userResource.roles().realmLevel().add(rolesToAssign);
            }
        }
    }

    @Transactional
    public void deleteUser(String keycloakId) {
        try {
            keycloak.realm(realm).users().get(keycloakId).remove();
        } catch (Exception e) {
            log.warn("Impossible de supprimer l'utilisateur {} de Keycloak", keycloakId, e);
        }

        if (userRepository.existsById(keycloakId)) {
            userRepository.deleteById(keycloakId);
        }
    }

    private List<String> fetchFilteredRoles(String keycloakId) {
        try {
            return keycloak.realm(realm).users().get(keycloakId)
                    .roles().realmLevel().listAll().stream()
                    .filter(Objects::nonNull)
                    .map(role -> role.getName())
                    .filter(name -> name != null && !IGNORED_SYSTEM_ROLES.contains(name))
                    .toList();
        } catch (Exception e) {
            log.warn("Erreur de récupération des rôles pour {}", keycloakId);
            return List.of();
        }
    }

    private User createNewUser(String keycloakId, String username, String email, String firstName, String lastName) {
        User user = User.builder()
                .keycloakId(keycloakId)
                .username(username != null ? username : email)
                .email(email)
                .firstName(firstName)
                .lastName(lastName)
                .active(true)
                .build();

        return userRepository.save(user);
    }

    private User updateExistingUser(User user, String email, String firstName, String lastName) {
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        return userRepository.save(user);
    }

    private UserResponseDto mapToDto(User user) {
        return UserResponseDto.builder()
                .keycloakId(user.getKeycloakId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .roles(fetchFilteredRoles(user.getKeycloakId()))
                .build();
    }
}