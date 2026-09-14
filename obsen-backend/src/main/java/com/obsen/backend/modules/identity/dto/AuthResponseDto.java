package com.obsen.backend.modules.identity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponseDto {
    private String token;
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String region;
    private String role;
}