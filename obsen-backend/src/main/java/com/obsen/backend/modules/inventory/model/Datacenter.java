package com.obsen.backend.modules.inventory.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "datacenters")
public class Datacenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Ex: "Dakar DataCenter Tier III"

    private String location; // Ex: "Zone Franche, Diamniadio"

    @Column(name = "tenant_id", nullable = false)
    private String tenantId; // L'identifiant du client propriétaire du site

    @OneToMany(mappedBy = "datacenter", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DatacenterAsset> assets = new ArrayList<>();

    // Constructeurs
    public Datacenter() {}

    public Datacenter(String name, String location, String tenantId) {
        this.name = name;
        this.location = location;
        this.tenantId = tenantId;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public List<DatacenterAsset> getAssets() { return assets; }
    public void setAssets(List<DatacenterAsset> assets) { this.assets = assets; }
}