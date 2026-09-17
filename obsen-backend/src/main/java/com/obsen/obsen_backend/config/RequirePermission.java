package com.obsen.obsen_backend.config;

import org.springframework.security.access.prepost.PreAuthorize;

import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@PreAuthorize("@keycloakAuthz.hasPermission(#resource, #scope)")
public @interface RequirePermission {
    String resource();
    String scope();
}