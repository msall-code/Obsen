package com.obsen.backend.modules.inventory.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.obsen.backend.modules.inventory.model.Equipement;
import com.obsen.backend.modules.inventory.model.StatutRAG;

public interface EquipementRepository extends JpaRepository<Equipement, Long> {
    Optional<Equipement> findByGlpiId(Long glpiId);
    List<Equipement> findByStatut(StatutRAG statut);
    Optional<Equipement> findByIpAdresse(String ipAdresse);
}