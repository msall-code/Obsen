package com.obsen.backend.modules.identity.service;

import com.obsen.backend.modules.identity.dto.UserCreateDto;
import com.obsen.backend.modules.identity.dto.UserResponseDto;
import com.obsen.backend.modules.identity.model.UserProfile;
import com.obsen.backend.modules.identity.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;
    private final KeycloakAdminService keycloakAdminService;

    @Transactional
    public UserResponseDto createUser(UserCreateDto dto) {
        // 1. Appel du bon nom de méthode exposée par KeycloakAdminService
        String keycloakId = keycloakAdminService.createUserInKeycloak(dto);

        // 2. Sauvegarde du profil utilisateur en BDD locale
        UserProfile profile = UserProfile.builder()
                .keycloakId(keycloakId)
                .username(dto.getUsername())
                .email(dto.getEmail())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .role(dto.getRole())
                .build();

        UserProfile saved = userProfileRepository.save(profile);

        return mapToResponseDto(saved);
    }

    private UserResponseDto mapToResponseDto(UserProfile profile) {
        return UserResponseDto.builder()
                .keycloakId(profile.getKeycloakId())
                .username(profile.getUsername())
                .email(profile.getEmail())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .role(profile.getRole())
                .build();
    }
}