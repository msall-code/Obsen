package com.obsen.obsen_backend.config;

import org.keycloak.authorization.client.AuthzClient;
import org.keycloak.authorization.client.Configuration;
import org.keycloak.authorization.client.representation.TokenIntrospectionResponse;
import org.keycloak.representations.idm.authorization.AuthorizationRequest;
import org.keycloak.representations.idm.authorization.AuthorizationResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service("keycloakAuthz")
public class KeycloakAuthorizationService {

    private final AuthzClient authzClient;

    public KeycloakAuthorizationService(
            @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}") String issuerUri,
            @Value("${spring.security.oauth2.client.registration.keycloak.client-id}") String clientId,
            @Value("${spring.security.oauth2.client.registration.keycloak.client-secret}") String clientSecret) {

        Map<String, Object> credentials = new HashMap<>();
        credentials.put("secret", clientSecret);

        Configuration configuration = new Configuration(
                issuerUri.substring(0, issuerUri.indexOf("/realms/")),
                issuerUri.substring(issuerUri.lastIndexOf("/") + 1),
                clientId,
                credentials,
                null
        );

        this.authzClient = AuthzClient.create(configuration);
    }

    public boolean hasPermission(String resourceName, String scope) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            return false;
        }

        try {
            AuthorizationRequest request = new AuthorizationRequest();
            request.addPermission(resourceName, scope);

            AuthorizationResponse response = authzClient.authorization(jwt.getTokenValue()).authorize(request);
            String rptToken = response.getToken();

            TokenIntrospectionResponse introspection = authzClient.protection().introspectRequestingPartyToken(rptToken);
            return Boolean.TRUE.equals(introspection.getActive());
        } catch (RuntimeException e) {
            return false;
        }
    }
}