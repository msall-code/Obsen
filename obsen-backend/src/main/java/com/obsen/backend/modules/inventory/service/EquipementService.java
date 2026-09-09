package com.obsen.backend.modules.inventory.service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import com.obsen.backend.modules.inventory.model.Equipement;
import com.obsen.backend.modules.inventory.repository.EquipementRepository;

@Service
public class EquipementService {

    private final EquipementRepository equipementRepository;

    public EquipementService(EquipementRepository equipementRepository) {
        this.equipementRepository = equipementRepository;
    }

    public List<Equipement> findAll() {
        return equipementRepository.findAll();
    }

    public Optional<Equipement> findById(@NonNull Long id) {
        return equipementRepository.findById(Objects.requireNonNull(id, "ID cannot be null"));
    }

    public Equipement save(@NonNull Equipement equipement) {
        return equipementRepository.save(Objects.requireNonNull(equipement, "Equipement cannot be null"));
    }

    public void deleteById(@NonNull Long id) {
        equipementRepository.deleteById(Objects.requireNonNull(id, "ID cannot be null"));
    }
}