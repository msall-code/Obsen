package com.obsen.backend.modules.identity.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;


import com.obsen.backend.modules.identity.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}