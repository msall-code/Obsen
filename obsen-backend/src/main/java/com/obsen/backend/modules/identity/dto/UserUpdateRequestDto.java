package com.obsen.backend.modules.identity.dto;

import com.obsen.backend.modules.identity.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequestDto {
    private String email;
    private String firstName;
    private String lastName;
    private String region;
    private Role role;
    private Boolean active;
}