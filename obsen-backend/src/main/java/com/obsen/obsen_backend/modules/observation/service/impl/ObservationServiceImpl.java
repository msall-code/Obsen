package com.obsen.obsen_backend.modules.observation.service.impl;

import com.obsen.obsen_backend.modules.observation.model.Observation;
import com.obsen.obsen_backend.modules.observation.model.Observation.ObservationStatus;
import com.obsen.obsen_backend.modules.observation.dto.request.CreateObservationRequest;
import com.obsen.obsen_backend.modules.observation.dto.response.ObservationResponse;
import com.obsen.obsen_backend.modules.observation.repository.ObservationRepository;
import com.obsen.obsen_backend.modules.observation.service.ObservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ObservationServiceImpl implements ObservationService {

    private final ObservationRepository observationRepository;

    @Override
    public ObservationResponse createObservation(CreateObservationRequest request, String userId) {
        Observation observation = Observation.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .status(ObservationStatus.PENDING)
                .userId(userId)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build();

        Observation saved = observationRepository.save(observation);
        return mapToResponse(saved);
    }

    @Override
    public List<ObservationResponse> getAllObservations() {
        return observationRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<ObservationResponse> getObservationsByUserId(String userId) {
        return observationRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public ObservationResponse getObservationById(Long id) {
        Observation observation = observationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Observation introuvable avec l'ID: " + id));
        return mapToResponse(observation);
    }

    private ObservationResponse mapToResponse(Observation observation) {
        return ObservationResponse.builder()
                .id(observation.getId())
                .title(observation.getTitle())
                .description(observation.getDescription())
                .category(observation.getCategory())
                .status(observation.getStatus())
                .userId(observation.getUserId())
                .latitude(observation.getLatitude())
                .longitude(observation.getLongitude())
                .createdAt(observation.getCreatedAt())
                .updatedAt(observation.getUpdatedAt())
                .build();
    }
}