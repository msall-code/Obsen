package com.obsen.obsen_backend.modules.observation.dto.request;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateObservationRequest {

    @Size(max = 150, message = "Le titre ne doit pas dépasser 150 caractères")
    private String title;

    private String description;
    private String category;
    private Double latitude;
    private Double longitude;
}