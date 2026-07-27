package com.obsen.backend.modules.inventory.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.obsen.backend.modules.inventory.model.DatacenterAsset;

public interface DatacenterAssetRepository extends JpaRepository<DatacenterAsset, Long> {
    // Permet de lister le matériel ou les logiciels d'un datacenter spécifique
    List<DatacenterAsset> findByDatacenterId(Long datacenterId);
}