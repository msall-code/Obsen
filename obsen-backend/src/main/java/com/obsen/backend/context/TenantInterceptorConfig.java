package com.obsen.backend.context;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class TenantInterceptorConfig implements WebMvcConfigurer {

    private final TenantHttpInterceptor tenantHttpInterceptor;

    // ✅ Injection par constructeur (recommandée par Spring et ton IDE)
    public TenantInterceptorConfig(TenantHttpInterceptor tenantHttpInterceptor) {
        this.tenantHttpInterceptor = tenantHttpInterceptor;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(tenantHttpInterceptor)
                .addPathPatterns("/api/v1/**") 
                .excludePathPatterns("/api/v1/diagnostic/**"); // Exclut bien le statut de diagnostic
    }
}