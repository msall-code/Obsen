package com.obsen.obsen_backend.modules.observation.service;

import com.obsen.obsen_backend.modules.observation.dto.request.CreateObservationRequest;
import com.obsen.obsen_backend.modules.observation.dto.response.ObservationResponse;

import java.util.List;

public interface ObservationService {
    ObservationResponse createObservation(CreateObservationRequest request, String userId);
    List<ObservationResponse> getAllObservations();
    List<ObservationResponse> getObservationsByUserId(String userId);
    ObservationResponse getObservationById(Long id);
}