package com.obsen.service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.obsen.dto.UserCreateDto;
import com.obsen.dto.UserResponseDto;
import com.obsen.entity.User;
import com.obsen.repository.UserRepository;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    @Transactional
    public UserResponseDto createUser(UserCreateDto dto) {
        // 1. Création Keycloak
        UserRepresentation kcUser = new UserRepresentation();
        kcUser.setUsername(dto.getUsername());
        kcUser.setEmail(dto.getEmail());
        kcUser.setFirstName(dto.getFirstName());
        kcUser.setLastName(dto.getLastName());
        kcUser.setEnabled(true);

        CredentialRepresentation cred = new CredentialRepresentation();
        cred.setType(CredentialRepresentation.PASSWORD);
        cred.setValue(dto.getPassword());
        cred.setTemporary(false);
        kcUser.setCredentials(Collections.singletonList(cred));

        UsersResource usersResource = keycloak.realm(realm).users();
        Response response = usersResource.create(kcUser);

        if (response.getStatus() != 201) {
            throw new RuntimeException("Erreur de création Keycloak: " + response.getStatusInfo().getReasonPhrase());
        }

        String keycloakId = response.getLocation().getPath().replaceAll(".*/([^/]+)$", "$1");

        // 2. Création DB locale
        User localUser = User.builder()
                .keycloakId(keycloakId)
                .username(dto.getUsername())
                .email(dto.getEmail())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .region(dto.getRegion())
                .role(dto.getRole())
                .active(true)
                .build();

        userRepository.save(localUser);

        return mapToResponse(localUser);
    }

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private UserResponseDto mapToResponse(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .keycloakId(user.getKeycloakId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .region(user.getRegion())
                .role(user.getRole())
                .active(user.isActive())
                .build();
    }
}