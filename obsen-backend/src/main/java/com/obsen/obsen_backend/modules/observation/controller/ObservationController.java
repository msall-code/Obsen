package com.obsen.obsen_backend.modules.observation.controller;

import com.obsen.obsen_backend.modules.observation.dto.request.CreateObservationRequest;
import com.obsen.obsen_backend.modules.observation.dto.response.ObservationResponse;
import com.obsen.obsen_backend.modules.observation.service.ObservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/observations")
@RequiredArgsConstructor
public class ObservationController {

    private final ObservationService observationService;

    @PostMapping
    public ResponseEntity<ObservationResponse> create(
            @Valid @RequestBody CreateObservationRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject(); // Extrait automatiquement l'ID unique de l'utilisateur du Token JWT
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(observationService.createObservation(request, userId));
    }

    @GetMapping
    public ResponseEntity<List<ObservationResponse>> getAll() {
        return ResponseEntity.ok(observationService.getAllObservations());
    }

    @GetMapping("/my")
    public ResponseEntity<List<ObservationResponse>> getMyObservations(@AuthenticationPrincipal Jwt jwt) {
        String userId = jwt.getSubject();
        return ResponseEntity.ok(observationService.getObservationsByUserId(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ObservationResponse> getById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(observationService.getObservationById(id));
    }
    
}