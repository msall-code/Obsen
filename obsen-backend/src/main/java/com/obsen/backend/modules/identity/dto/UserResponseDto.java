package com.obsen.backend.modules.identity.dto;

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
    private String role;
}