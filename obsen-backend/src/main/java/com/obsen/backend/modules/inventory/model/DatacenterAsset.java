package com.obsen.backend.modules.inventory.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "datacenter_assets")
public class DatacenterAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Ex: "Serveur_Dell_PowerEdge_01", "PostgreSQL_Prod"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssetType type; // HARDWARE ou SOFTWARE

    @Column(name = "ip_address")
    private String ipAddress; // Adresse de la ressource ou du conteneur

    @Column(nullable = false)
    private String status; // UP, DOWN, WARNING, MAINTENANCE

    @Column(name = "metrics_job_name", nullable = false)
    private String metricsJobName; // Nom du job associé dans le fichier prometheus.yml

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "datacenter_id", nullable = false)
    private Datacenter datacenter;

    public enum AssetType {
        HARDWARE, SOFTWARE
    }

    // Constructeurs
    public DatacenterAsset() {}

    public DatacenterAsset(String name, AssetType type, String ipAddress, String status, String metricsJobName, Datacenter datacenter) {
        this.name = name;
        this.type = type;
        this.ipAddress = ipAddress;
        this.status = status;
        this.metricsJobName = metricsJobName;
        this.datacenter = datacenter;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public AssetType getType() { return type; }
    public void setType(AssetType type) { this.type = type; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMetricsJobName() { return metricsJobName; }
    public void setMetricsJobName(String metricsJobName) { this.metricsJobName = metricsJobName; }

    public Datacenter getDatacenter() { return datacenter; }
    public void setDatacenter(Datacenter datacenter) { this.datacenter = datacenter; }
}