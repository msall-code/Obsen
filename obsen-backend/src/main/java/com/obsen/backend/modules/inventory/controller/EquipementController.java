package com.obsen.backend.modules.inventory.controller;

import java.util.List;
import java.util.Objects;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.obsen.backend.modules.inventory.dto.EquipementDTO;
import com.obsen.backend.modules.inventory.mapper.EquipementMapper;
import com.obsen.backend.modules.inventory.model.Equipement;
import com.obsen.backend.modules.inventory.service.EquipementService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inventory/equipments")
@RequiredArgsConstructor
public class EquipementController {

    private final EquipementService equipementService;
    private final EquipementMapper equipementMapper;

    @GetMapping
    public ResponseEntity<List<Equipement>> getAllEquipments() {
        return ResponseEntity.ok(equipementService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipement> getEquipmentById(@PathVariable Long id) {
        return equipementService.findById(Objects.requireNonNull(id, "ID must not be null"))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Equipement> createEquipment(@RequestBody EquipementDTO dto) {
        Equipement entity = equipementMapper.toEntity(Objects.requireNonNull(dto, "DTO must not be null"));
        if (entity == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(equipementService.save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipment(@PathVariable Long id) {
        equipementService.deleteById(Objects.requireNonNull(id, "ID must not be null"));
        return ResponseEntity.noContent().build();
    }
}