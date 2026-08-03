package com.obsen.backend.context;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Objects;

@Configuration
public class TenantInterceptorConfig implements WebMvcConfigurer {

    private final TenantHttpInterceptor tenantHttpInterceptor;

    public TenantInterceptorConfig(@NonNull TenantHttpInterceptor tenantHttpInterceptor) {
        this.tenantHttpInterceptor = Objects.requireNonNull(tenantHttpInterceptor, "tenantHttpInterceptor cannot be null");
    }

    @Override
public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(tenantHttpInterceptor)
            .addPathPatterns("/api/v1/**")
            .excludePathPatterns(
                "/api/v1/diagnostic/**", 
                "/api/v1/auth/**",      // Exclure le login/refresh
                "/api/v1/public/**"

            );

        }
    }
