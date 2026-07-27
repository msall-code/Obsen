package com.obsen.backend.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/diagnostic")
public class DiagnosticController {

    /**
     * Endpoint appelé par le Frontend pour vérifier la santé de la passerelle SRE
     */
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> response = new HashMap<>();
        
        // Le front cherche une réponse qui confirme que le back est opérationnel
        response.put("status", "success");
        response.put("gateway", "UP");
        response.put("engine", "Obsen Cognitive Engine - Actif");
        response.put("timestamp", System.currentTimeMillis());
        
        return ResponseEntity.ok(response);
    }
}