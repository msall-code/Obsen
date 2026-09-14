package com.obsen.backend.modules.identity.dto;

import com.obsen.backend.modules.identity.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserUpdateRequestDto {
    private String email;
    private String firstName;
    private String lastName;
    private String region;
    private Role role;
    private Boolean active;
}