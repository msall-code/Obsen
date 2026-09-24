package com.obsen.obsen_backend.modules.observation.dto.response;

import com.obsen.obsen_backend.modules.observation.model.Observation.ObservationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ObservationResponse {

    private Long id;
    private String title;
    private String description;
    private String category;
    private ObservationStatus status;
    private String userId;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}