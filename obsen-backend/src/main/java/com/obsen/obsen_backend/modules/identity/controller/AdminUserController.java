package com.obsen.obsen_backend.modules.identity.controller;

import com.obsen.obsen_backend.modules.identity.dto.response.UserResponse;
import com.obsen.obsen_backend.modules.identity.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/users")
@PreAuthorize("hasRole('Admin')") // "Admin" correspond exactement au nom du rôle dans Keycloak
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(AdminUserService adminUserService) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(adminUserService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable("id") String userId) {
        return ResponseEntity.ok(adminUserService.getUserById(userId));
    }

    @PostMapping("/{id}/roles/{roleName}")
    public ResponseEntity<Void> assignRole(@PathVariable("id") String userId, @PathVariable("roleName") String roleName) {
        adminUserService.assignRoleToUser(userId, roleName);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> toggleStatus(@PathVariable("id") String userId, @RequestParam("enabled") boolean enabled) {
        adminUserService.toggleUserStatus(userId, enabled);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") String userId) {
        adminUserService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}