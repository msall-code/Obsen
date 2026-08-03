package com.obsen.backend.context;

import java.util.Objects; // <-- A'ajouter ici
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class TenantInterceptorConfig implements WebMvcConfigurer {

    private final TenantHttpInterceptor tenantHttpInterceptor;

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(Objects.requireNonNull(tenantHttpInterceptor))
                .addPathPatterns("/api/v1/**")
                .excludePathPatterns(
                        "/api/v1/diagnostic/**",
                        "/api/v1/auth/**",
                        "/api/v1/public/**",
                        "/v3/api-docs/**",
                        "/swagger-ui/**"
                );
    }
}