package com.obsen.dto;

import lombok.Data;

@Data
public class UserCreateDto {
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String region;
    private String role;
}