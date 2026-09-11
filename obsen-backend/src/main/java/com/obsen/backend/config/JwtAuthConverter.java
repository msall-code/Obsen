/*
package com.obsen.backend.config;

import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.convert.converter.Converter;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.stereotype.Component;

@Component
public class JwtAuthConverter implements Converter<Jwt, AbstractAuthenticationToken> {

    private static final Logger LOG = LoggerFactory.getLogger(JwtAuthConverter.class);
    private static final String ROLE_PREFIX = "ROLE_";
    private static final String ROLES_CLAIM = "roles";

    private final JwtGrantedAuthoritiesConverter defaultGrantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

    @Override
    public AbstractAuthenticationToken convert(@NonNull Jwt jwt) {
        Collection<GrantedAuthority> defaultAuthorities = Objects.requireNonNullElse(
                defaultGrantedAuthoritiesConverter.convert(jwt),
                Collections.emptyList()
        );

        Collection<GrantedAuthority> authorities = Stream.concat(
                defaultAuthorities.stream(),
                extractAllRoles(jwt).stream()
        ).collect(Collectors.toSet());

        String principalName = getPrincipalClaimName(jwt);

        LOG.info("🔐 [JWT CONVERTER] Utilisateur: '{}' | Autorités extraites: {}", principalName, authorities);

        return new JwtAuthenticationToken(jwt, authorities, principalName);
    }

    private String getPrincipalClaimName(Jwt jwt) {
        String preferredUsername = jwt.getClaim("preferred_username");
        return preferredUsername != null ? preferredUsername : jwt.getSubject();
    }

    private Collection<GrantedAuthority> extractAllRoles(Jwt jwt) {
        Set<String> rawRoles = new HashSet<>();

        // 1. Realm Roles (realm_access.roles)
        Map<String, Object> realmAccess = jwt.getClaim("realm_access");
        if (realmAccess != null && realmAccess.get(ROLES_CLAIM) instanceof List<?> roles) {
            roles.stream()
                    .filter(String.class::isInstance)
                    .map(String.class::cast)
                    .forEach(rawRoles::add);
        }

        // 2. Client Roles (resource_access.<client_id>.roles)
        Map<String, Object> resourceAccess = jwt.getClaim("resource_access");
        if (resourceAccess != null) {
            resourceAccess.values().forEach(client -> {
                if (client instanceof Map<?, ?> clientMap && clientMap.get(ROLES_CLAIM) instanceof List<?> clientRoles) {
                    clientRoles.stream()
                            .filter(String.class::isInstance)
                            .map(String.class::cast)
                            .forEach(rawRoles::add);
                }
            });
        }

        // 3. Simple claim "roles" racine
        List<String> rootRoles = jwt.getClaimAsStringList(ROLES_CLAIM);
        if (rootRoles != null) {
            rawRoles.addAll(rootRoles);
        }

        return mapRolesToAuthorities(rawRoles);
    }

    private Set<GrantedAuthority> mapRolesToAuthorities(Set<String> rawRoles) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        for (String role : rawRoles) {
            if (role == null || role.isBlank()) {
                continue;
            }

            String formattedRole = role.trim().toUpperCase();
            if (!formattedRole.startsWith(ROLE_PREFIX)) {
                formattedRole = ROLE_PREFIX + formattedRole;
            }

            authorities.add(new SimpleGrantedAuthority(formattedRole));
        }
        return authorities;
    }
}
*/