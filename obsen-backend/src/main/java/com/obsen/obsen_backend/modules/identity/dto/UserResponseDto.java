package com.obsen.obsen_backend.modules.identity.dto;

import java.time.Instant;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDto {
    private String keycloakId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private boolean active;
    private Instant createdAt;
    private List<String> roles;
}