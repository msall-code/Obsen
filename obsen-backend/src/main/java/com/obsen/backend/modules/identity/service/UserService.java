package com.obsen.backend.modules.identity.service;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.obsen.backend.modules.identity.dto.UserResponseDto;
import com.obsen.backend.modules.identity.model.User;
import com.obsen.backend.modules.identity.repository.UserProfileRepository;

@Service
public class UserService {

    private final UserProfileRepository userRepository;

    public UserService(UserProfileRepository userRepository) {
        this.userRepository = userRepository; // <-- CORRIGÉ : this.userRepository au lieu de userProfileRepository
    }

    /**
     * Synchronise le profil utilisateur en base locale à partir du Token JWT de Keycloak
     */
    public UserResponseDto syncUserProfile(Jwt jwt) {
        String keycloakId = jwt.getSubject();
        String username = jwt.getClaimAsString("preferred_username");
        String email = jwt.getClaimAsString("email");
        String firstName = jwt.getClaimAsString("given_name");
        String lastName = jwt.getClaimAsString("family_name");

        User user = userRepository.findByKeycloakId(keycloakId)
                .orElseGet(() -> User.builder()
                        .keycloakId(keycloakId)
                        .build());

        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);

        User savedUser = userRepository.save(user);

        return UserResponseDto.builder()
                .id(savedUser.getId())
                .keycloakId(savedUser.getKeycloakId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .firstName(savedUser.getFirstName())
                .lastName(savedUser.getLastName())
                .build();
    }
}