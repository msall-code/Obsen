package com.obsen.obsen_backend.modules.observation.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateObservationRequest {

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 150, message = "Le titre ne doit pas dépasser 150 caractères")
    private String title;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    private String category;
    private Double latitude;
    private Double longitude;
}