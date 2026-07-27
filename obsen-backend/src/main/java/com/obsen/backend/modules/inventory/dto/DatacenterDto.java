package com.obsen.backend.modules.inventory.dto;

import java.util.List;

public class DatacenterDto {
    private Long id;
    private String name;
    private String location;
    private List<DatacenterAssetDto> assets;

    // Remarque : Le champ "tenantId" n'est PAS présent ici. 
    // L'API externe n'a pas besoin de savoir comment on segmente les données en interne.

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public List<DatacenterAssetDto> getAssets() { return assets; }
    public void setAssets(List<DatacenterAssetDto> assets) { this.assets = assets; }
}