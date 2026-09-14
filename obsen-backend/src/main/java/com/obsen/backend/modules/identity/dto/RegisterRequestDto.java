package com.obsen.backend.modules.identity.dto;

import com.obsen.backend.modules.identity.model.Role;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDto {
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String region;
    private Role role;
}