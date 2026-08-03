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
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        // Envelopper explicitement l'objet pour satisfaire l'inspection @NonNull
        registry.addInterceptor(Objects.requireNonNull(tenantHttpInterceptor))
                .addPathPatterns("/api/v1/**") 
                .excludePathPatterns("/api/v1/diagnostic/**");
    }
}