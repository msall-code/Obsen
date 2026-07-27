package com.obsen.backend.modules.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.obsen.backend.modules.inventory.model.Datacenter;

// L'annotation @Repository a été supprimée ici, Spring s'occupe de tout via JpaRepository
public interface DatacenterRepository extends JpaRepository<Datacenter, Long> {
    List<Datacenter> findByTenantId(String tenantId);
}