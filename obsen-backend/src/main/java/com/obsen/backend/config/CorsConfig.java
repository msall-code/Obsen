package com.obsen.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**") // On applique CORS sur tous les endpoints de l'API
                        .allowedOrigins("http://localhost:5173") // On autorise l'origine de ton application React
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // On autorise toutes les méthodes, y compris OPTIONS (Preflight)
                        .allowedHeaders("*") // On accepte tous les headers (notamment notre X-Tenant-ID et Content-Type)
                        .allowCredentials(true);
            }
        };
    }
}