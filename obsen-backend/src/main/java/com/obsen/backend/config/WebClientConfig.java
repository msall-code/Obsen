package com.obsen.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    /**
     * Crée un Bean WebClient réutilisable configuré pour pointer vers ton serveur Prometheus.
     * Par défaut, Prometheus écoute sur le port 9090.
     */
    @Bean
    public WebClient prometheusWebClient() {
        return WebClient.builder()
                .baseUrl("http://localhost:9090") // À adapter selon ton déploiement (Docker ou local)
                .build();
    }
}