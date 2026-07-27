package com.obsen.backend.modules.automation.dto;

import java.time.Instant;

public class AlertEventDto {
    private String assetName;
    private String metricType; // CPU, RAM, STATUS
    private String currentValue;
    private String severity;    // CRITICAL, WARNING
    private Long timestamp;

    public AlertEventDto(String assetName, String metricType, String currentValue, String severity) {
        this.assetName = assetName;
        this.metricType = metricType;
        this.currentValue = currentValue;
        this.severity = severity;
        this.timestamp = Instant.now().getEpochSecond();
    }

    // Getters et Setters
    public String getAssetName() { return assetName; }
    public void setAssetName(String assetName) { this.assetName = assetName; }
    public String getMetricType() { return metricType; }
    public void setMetricType(String metricType) { this.metricType = metricType; }
    public String getCurrentValue() { return currentValue; }
    public void setCurrentValue(String currentValue) { this.currentValue = currentValue; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
    public Long getTimestamp() { return timestamp; }
    public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }
}