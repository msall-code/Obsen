package com.obsen.backend.modules.identity.service;

import com.obsen.backend.modules.identity.dto.UserCreateDto;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class KeycloakAdminService {

    private final Keycloak keycloak;

    @Value("${keycloak.realm:Obsen}")
    private String realm;

    public String createUserInKeycloak(UserCreateDto dto) {
        UserRepresentation user = new UserRepresentation();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setEnabled(true);

        // Mot de passe initial
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(dto.getPassword() != null ? dto.getPassword() : "TempPass123!");
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));

        UsersResource usersResource = keycloak.realm(realm).users();
        Response response = usersResource.create(user);

        if (response.getStatus() == 201) {
            String userId = CreatedResponseUtil.getCreatedId(response);
            log.info("Utilisateur {} créé sur Keycloak avec le ID: {}", dto.getUsername(), userId);
            return userId;
        } else {
            log.error("Échec de la création de l'utilisateur Keycloak. Code statut: {}", response.getStatus());
            throw new RuntimeException("Erreur lors de la création sur Keycloak, code : " + response.getStatus());
        }
    }

    public List<UserRepresentation> getAllUsersFromKeycloak() {
        return keycloak.realm(realm).users().list();
    }

    public void deleteUserFromKeycloak(String keycloakId) {
        keycloak.realm(realm).users().delete(keycloakId);
        log.info("Utilisateur Keycloak supprimé: {}", keycloakId);
    }
}