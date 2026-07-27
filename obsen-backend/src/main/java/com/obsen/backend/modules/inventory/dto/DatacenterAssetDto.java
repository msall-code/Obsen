package com.obsen.backend.modules.inventory.dto;

public class DatacenterAssetDto {
    private Long id;
    private String name;
    private String type; // HARDWARE ou SOFTWARE
    private String ipAddress;
    private String status; // UP, DOWN, WARNING
    private String metricsJobName;

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getMetricsJobName() { return metricsJobName; }
    public void setMetricsJobName(String metricsJobName) { this.metricsJobName = metricsJobName; }
}