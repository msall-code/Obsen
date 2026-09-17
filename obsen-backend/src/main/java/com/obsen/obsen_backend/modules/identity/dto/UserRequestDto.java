package com.obsen.obsen_backend.modules.identity.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String password; // Permet de réinitialiser le mot de passe
}