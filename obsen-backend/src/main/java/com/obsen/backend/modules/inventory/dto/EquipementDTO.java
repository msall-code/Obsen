package com.obsen.backend.modules.inventory.dto;

import com.obsen.backend.modules.inventory.model.StatutRAG;

import lombok.Data;

@Data
public class EquipementDTO {
    private Long id;
    private Long glpiId;
    private String name;
    private String ipAdresse;
    private StatutRAG statut;
    private String location;
}