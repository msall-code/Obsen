package com.obsen.backend.modules.inventory.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.obsen.backend.context.TenantContext;
import com.obsen.backend.modules.inventory.dto.DatacenterDto;
import com.obsen.backend.modules.inventory.mapper.InventoryMapper;
import com.obsen.backend.modules.inventory.model.Datacenter;
import com.obsen.backend.modules.inventory.repository.DatacenterRepository;

@Service
@Transactional(readOnly = true)
public class InventoryService {

    private final DatacenterRepository datacenterRepository;
    private final InventoryMapper inventoryMapper;

    public InventoryService(DatacenterRepository datacenterRepository, InventoryMapper inventoryMapper) {
        this.datacenterRepository = datacenterRepository;
        this.inventoryMapper = inventoryMapper;
    }

    public List<DatacenterDto> getAllDatacentersForCurrentTenant() {
        String currentTenant = TenantContext.getCurrentTenant();
        List<Datacenter> datacenters = datacenterRepository.findByTenantId(currentTenant);
        
        // CORRECTION : Modernisation avec .toList()
        return datacenters.stream()
                .map(inventoryMapper::toDatacenterDto)
                .toList();
    }
}