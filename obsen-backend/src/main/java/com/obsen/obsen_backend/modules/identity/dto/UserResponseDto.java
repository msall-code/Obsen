package com.obsen.obsen_backend.modules.identity.dto;

import java.time.Instant;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponseDto {
    private String keycloakId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private boolean active;
    private Instant createdAt;
}