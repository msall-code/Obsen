package com.obsen.backend.modules.identity.service;

import com.obsen.backend.modules.identity.model.UserProfile;
import com.obsen.backend.modules.identity.repository.UserProfileRepository;
import com.obsen.backend.modules.identity.dto.UserCreateDto;
import com.obsen.backend.modules.identity.dto.UserResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;
    private final KeycloakAdminService keycloakAdminService;

    public UserResponseDto createUser(UserCreateDto dto) {
        // Appeler la méthode exacte définie dans KeycloakAdminService
        String keycloakId = keycloakAdminService.createUserInKeycloak(dto);

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