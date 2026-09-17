package com.obsen.obsen_backend.modules.identity.service;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.obsen.obsen_backend.modules.identity.dto.UserResponseDto;
import com.obsen.obsen_backend.modules.identity.model.User;
import com.obsen.obsen_backend.modules.identity.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IdentityService {

    private final UserRepository userRepository;

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

    @Transactional
    public void deleteUser(String id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
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
                .build();
    }
    
}