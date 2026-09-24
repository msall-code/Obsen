package com.obsen.obsen_backend.modules.observation.repository;

import com.obsen.obsen_backend.modules.observation.model.Observation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ObservationRepository extends JpaRepository<Observation, Long> {
    
    List<Observation> findByUserId(String userId);

    List<Observation> findByStatus(Observation.ObservationStatus status);
}