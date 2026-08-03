package com.obsen.backend.modules.identity.service;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.obsen.backend.modules.identity.dto.UserCreateDto;
import com.obsen.backend.modules.identity.dto.UserResponseDto;
import com.obsen.backend.modules.identity.model.UserProfile;
import com.obsen.backend.modules.identity.repository.UserProfileRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserProfileRepository userProfileRepository;
    private final KeycloakAdminService keycloakAdminService;

    @Transactional
    public UserResponseDto createUser(UserCreateDto dto) {
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

        return mapToResponseDto(Objects.requireNonNull(saved, "Saved user profile must not be null"));
    }

    private UserResponseDto mapToResponseDto(@NonNull UserProfile profile) {
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