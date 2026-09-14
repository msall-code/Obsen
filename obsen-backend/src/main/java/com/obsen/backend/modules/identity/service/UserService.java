package com.obsen.backend.modules.identity.service;

import com.obsen.backend.modules.identity.dto.AuthResponseDto;
import com.obsen.backend.modules.identity.dto.UserUpdateRequestDto;
import com.obsen.backend.modules.identity.model.User;
import com.obsen.backend.modules.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class UserService {

    private static final String USER_NOT_FOUND_MSG = "Utilisateur non trouvé avec l'id : ";

    private final UserRepository userRepository;

    public List<AuthResponseDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToAuthResponseDto)
                .toList();
    }

    public AuthResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND_MSG + id));
        return mapToAuthResponseDto(user);
    }

    public AuthResponseDto updateUser(Long id, UserUpdateRequestDto dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND_MSG + id));

        if (dto.getEmail() != null && !dto.getEmail().equalsIgnoreCase(user.getEmail())) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getFirstName() != null) user.setFirstName(dto.getFirstName());
        if (dto.getLastName() != null) user.setLastName(dto.getLastName());
        if (dto.getRegion() != null) user.setRegion(dto.getRegion());
        if (dto.getRole() != null) user.setRole(dto.getRole().name());
        if (dto.getActive() != null) user.setActive(dto.getActive());

        User updatedUser = userRepository.save(user);
        return mapToAuthResponseDto(updatedUser);
    }

    public AuthResponseDto toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException(USER_NOT_FOUND_MSG + id));

        user.setActive(!user.isActive());
        User updatedUser = userRepository.save(user);
        return mapToAuthResponseDto(updatedUser);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new IllegalArgumentException(USER_NOT_FOUND_MSG + id);
        }
        userRepository.deleteById(id);
    }

    private AuthResponseDto mapToAuthResponseDto(User user) {
        return AuthResponseDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .region(user.getRegion())
                .role(user.getRole())
                .build();
    }
}