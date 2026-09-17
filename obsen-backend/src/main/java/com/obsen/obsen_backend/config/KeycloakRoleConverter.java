package com.obsen.obsen_backend.config;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;

public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    private static final String ROLES_CLAIM = "roles";

    @Override
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        // 1. Extraction des Rôles Realm (realm_access.roles)
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess != null && realmAccess.containsKey(ROLES_CLAIM)) {
            @SuppressWarnings("unchecked")
            List<String> roles = (List<String>) realmAccess.get(ROLES_CLAIM);
            authorities.addAll(roles.stream()
                    .map(roleName -> new SimpleGrantedAuthority("ROLE_" + roleName))
                    .toList());
        }

        // 2. Extraction des Rôles Client (resource_access.{client_id}.roles)
        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
        if (resourceAccess != null) {
            resourceAccess.forEach((clientId, resource) -> {
                if (resource instanceof Map<?, ?> resourceMap && resourceMap.containsKey(ROLES_CLAIM)) {
                    @SuppressWarnings("unchecked")
                    List<String> clientRoles = (List<String>) resourceMap.get(ROLES_CLAIM);
                    authorities.addAll(clientRoles.stream()
                            .map(roleName -> new SimpleGrantedAuthority("ROLE_" + clientId + "_" + roleName))
                            .toList());
                }
            });
        }

        return authorities;
    }
}