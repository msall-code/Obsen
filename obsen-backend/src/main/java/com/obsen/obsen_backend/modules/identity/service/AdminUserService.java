package com.obsen.obsen_backend.modules.identity.service;

import com.obsen.obsen_backend.modules.identity.dto.response.UserResponse;

import java.util.List;

public interface AdminUserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(String userId);
    void assignRoleToUser(String userId, String roleName);
    void toggleUserStatus(String userId, boolean enabled);
    void deleteUser(String userId);
}