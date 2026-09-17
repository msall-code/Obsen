package com.obsen.obsen_backend.config;

import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "Obsen Backend API",
                version = "v1.0",
                description = "Documentation interactive de l'API Obsen sécurisée par Keycloak"
        ),
        // Applique automatiquement l'exigence du token JWT à l'ensemble des endpoints dans Swagger UI
        security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        bearerFormat = "JWT",
        description = "Saisissez votre jeton JWT (access_token) délivré par Keycloak"
)
public class OpenApiConfig {
}
