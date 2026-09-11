package com.obsen.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.obsen.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByKeycloakId(String keycloakId);
    Optional<User> findByUsername(String username);
}