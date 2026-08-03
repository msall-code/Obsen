package com.obsen.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    @SuppressWarnings("java:S4502") // CSRF non requis pour une API REST Stateless / Auth endpoints
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Configuration CORS & CSRF
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            
            // Gestion de session Stateless (pas de cookies de session)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Configuration des autorisations d'accès
            .authorizeHttpRequests(auth -> auth
                // Autoriser les requêtes OPTIONS (CORS pre-flight)
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Endpoints publics (Auth & Actuator)
                .requestMatchers("/api/v1/auth/**", "/actuator/**").permitAll()
                // Tous les autres endpoints nécessitent une authentification JWT
                .anyRequest().authenticated()
            )
            
            // Support OAuth2 Resource Server (JWT)
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.setAllowedOrigins(List.of(
            "http://localhost:5173", 
            "http://127.0.0.1:5173"
        ));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
    
}