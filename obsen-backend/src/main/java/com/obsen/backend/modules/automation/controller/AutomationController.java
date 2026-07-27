package com.obsen.backend.modules.automation.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.obsen.backend.modules.automation.dto.AlertEventDto;
import com.obsen.backend.modules.automation.service.AutomationService;

@RestController
@RequestMapping("/api/v1/automation")
@CrossOrigin(origins = "http://localhost:5173")
public class AutomationController {

    private final AutomationService automationService;

    public AutomationController(AutomationService automationService) {
        this.automationService = automationService;
    }

    /**
     * Endpoint de simulation de panne pour valider la chaîne technique
     * URL: POST /api/v1/automation/trigger-test
     */
    @PostMapping("/trigger-test")
    public ResponseEntity<String> triggerTestAlert(@RequestBody AlertEventDto alertRequest) {
        automationService.triggerAutomationWorkflow(alertRequest);
        return ResponseEntity.ok("Incident envoyé à la tuyauterie d'automatisation.");
    }
}