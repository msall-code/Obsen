package com.obsen.backend.modules.inventory.mapper;

import com.obsen.backend.modules.inventory.dto.EquipementDTO;
import com.obsen.backend.modules.inventory.model.Equipement;
import org.springframework.stereotype.Component;

@Component
public class EquipementMapper {

    public Equipement toEntity(EquipementDTO dto) {
        if (dto == null) {
            return null;
        }

        Equipement equipement = new Equipement();
        equipement.setId(dto.getId());
        equipement.setGlpiId(dto.getGlpiId());
        equipement.setName(dto.getName());
        equipement.setIpAdresse(dto.getIpAdresse());
        equipement.setStatut(dto.getStatut());
        equipement.setLocation(dto.getLocation());

        return equipement;
    }

    public EquipementDTO toDto(Equipement entity) {
        if (entity == null) {
            return null;
        }

        EquipementDTO dto = new EquipementDTO();
        dto.setId(entity.getId());
        dto.setGlpiId(entity.getGlpiId());
        dto.setName(entity.getName());
        dto.setIpAdresse(entity.getIpAdresse());
        dto.setStatut(entity.getStatut());
        dto.setLocation(entity.getLocation());

        return dto;
    }
}