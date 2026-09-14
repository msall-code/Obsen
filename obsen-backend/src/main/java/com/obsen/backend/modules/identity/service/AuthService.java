package com.obsen.backend.modules.identity.service;

import com.obsen.backend.config.JwtUtils;
import com.obsen.backend.modules.identity.dto.AuthResponseDto;
import com.obsen.backend.modules.identity.dto.LoginRequestDto;
import com.obsen.backend.modules.identity.dto.RegisterRequestDto;
import com.obsen.backend.modules.identity.model.Role;
import com.obsen.backend.modules.identity.model.User;
import com.obsen.backend.modules.identity.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;

    @Transactional
    public AuthResponseDto register(RegisterRequestDto request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Ce nom d'utilisateur est déjà utilisé.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé.");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .region(request.getRegion())
                .role(((request.getRole() != null) ? request.getRole() : Role.AGENT).name())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(savedUser.getUsername());
        String jwtToken = jwtUtils.generateToken(userDetails);

        return buildAuthResponse(savedUser, jwtToken);
    }

    public AuthResponseDto login(LoginRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadCredentialsException("Utilisateur non trouvé."));

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getUsername());
        String jwtToken = jwtUtils.generateToken(userDetails);

        return buildAuthResponse(user, jwtToken);
    }

    private AuthResponseDto buildAuthResponse(User user, String token) {
        return AuthResponseDto.builder()
                .token(token)
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