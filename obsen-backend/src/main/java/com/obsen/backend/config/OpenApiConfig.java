package com.obsen.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "Obsen Backend API",
        version = "1.0",
        description = "Documentation API du backend Obsen sécurisée avec Keycloak OAuth2/JWT",
        contact = @Contact(
            name = "Obsen Team"
        )
    ),
    // Applique le mécanisme de sécurité JWT à l'ensemble des endpoints dans la documentation
    security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
    name = "bearerAuth",
    type = SecuritySchemeType.HTTP,
    scheme = "bearer",
    bearerFormat = "JWT",
    description = "Saisissez votre token JWT Keycloak (sans le préfixe 'Bearer ')"
)
public class OpenApiConfig {
}