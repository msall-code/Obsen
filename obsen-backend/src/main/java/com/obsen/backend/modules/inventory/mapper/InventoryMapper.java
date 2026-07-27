package com.obsen.backend.modules.inventory.mapper;

import org.springframework.stereotype.Component;

import com.obsen.backend.modules.inventory.dto.DatacenterAssetDto;
import com.obsen.backend.modules.inventory.dto.DatacenterDto;
import com.obsen.backend.modules.inventory.model.Datacenter;
import com.obsen.backend.modules.inventory.model.DatacenterAsset;

@Component
public class InventoryMapper {

    public DatacenterDto toDatacenterDto(Datacenter datacenter) {
        if (datacenter == null) return null;

        DatacenterDto dto = new DatacenterDto();
        dto.setId(datacenter.getId());
        dto.setName(datacenter.getName());
        dto.setLocation(datacenter.getLocation());
        
        if (datacenter.getAssets() != null) {
            // CORRECTION : Modernisation avec .toList()
            dto.setAssets(datacenter.getAssets().stream()
                    .map(this::toAssetDto)
                    .toList());
        }
        return dto;
    }

    public DatacenterAssetDto toAssetDto(DatacenterAsset asset) {
        if (asset == null) return null;

        DatacenterAssetDto dto = new DatacenterAssetDto();
        dto.setId(asset.getId());
        dto.setName(asset.getName());
        dto.setType(asset.getType().name());
        dto.setIpAddress(asset.getIpAddress());
        dto.setStatus(asset.getStatus());
        dto.setMetricsJobName(asset.getMetricsJobName());
        return dto;
    }
}