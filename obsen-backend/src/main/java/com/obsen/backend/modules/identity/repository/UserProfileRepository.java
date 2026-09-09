package com.obsen.backend.modules.identity.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.obsen.backend.modules.identity.model.User;

public interface UserProfileRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByKeycloakId(String keycloakId);
}