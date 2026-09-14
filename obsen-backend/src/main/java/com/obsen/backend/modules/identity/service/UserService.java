package com.obsen.backend.modules.identity.service;

import com.obsen.backend.modules.identity.dto.AuthResponseDto;
import com.obsen.backend.modules.identity.dto.UserUpdateRequestDto;
import com.obsen.backend.modules.identity.model.User;
import com.obsen.backend.modules.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<AuthResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AuthResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + id));
        return mapToDto(user);
    }

    @Transactional
    public AuthResponseDto updateUser(Long id, UserUpdateRequestDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + id));

        if (dto.getEmail() != null && !dto.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("L'adresse email est déjà utilisée.");
            }
            user.setEmail(dto.getEmail());
        }

        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getRegion() != null) user.setRegion(dto.getRegion());
        if (dto.getRole() != null) user.setRole(dto.getRole());
        if (dto.getActive() != null) user.setActive(dto.getActive());

        userRepository.save(user);

        return mapToDto(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur non trouvé avec l'id : " + id);
        }
        userRepository.deleteById(id);
    }

    @Transactional
    public AuthResponseDto toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + id));

        user.setActive(!user.isActive());
        userRepository.save(user);

        return mapToDto(user);
    }

    private AuthResponseDto mapToDto(User user) {
        return AuthResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .region(user.getRegion())
                .role(user.getRole().name())
                .build();
    }
}