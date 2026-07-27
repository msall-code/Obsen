package com.obsen.backend.modules.automation.service;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.obsen.backend.modules.automation.dto.AlertEventDto;

@Service
public class AutomationService {

    private final WebClient n8nWebClient;

    // On configure à la volée un WebClient pointant sur le webhook de ton n8n local (port 5678 par défaut)
    public AutomationService() {
        this.n8nWebClient = WebClient.builder()
                .baseUrl("http://localhost:5678")
                .build();
    }

    /**
     * Propulse l'alerte vers le workflow n8n de manière totalement asynchrone
     */
    public void triggerAutomationWorkflow(AlertEventDto alert) {
        System.out.println("⚠️ [Obsen-Automation] Déclenchement d'alerte pour : " + alert.getAssetName());

        // Appel non-bloquant (.subscribe) pour ne jamais ralentir le reste d'Obsen
        n8nWebClient.post()
                .uri("/webhook/obsen-alerts") // L'URL exacte générée par ton nœud Webhook dans n8n
                .bodyValue(alert)
                .retrieve()
                .bodyToMono(String.class)
                .subscribe(
                    response -> System.out.println("✅ Synchro n8n réussie : " + response),
                    error -> System.err.println("❌ Échec de liaison avec n8n : " + error.getMessage())
                );
    }
}