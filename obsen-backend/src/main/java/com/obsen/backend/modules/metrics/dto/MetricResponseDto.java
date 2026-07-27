package com.obsen.backend.modules.metrics.dto;

import java.util.List;

public class MetricResponseDto {
    private String status; // "success" ou "error"
    private List<MetricPoint> data;

    public MetricResponseDto(String status, List<MetricPoint> data) {
        this.status = status;
        this.data = data;
    }

    // Getters et Setters
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<MetricPoint> getData() { return data; }
    public void setData(List<MetricPoint> data) { this.data = data; }

    /**
     * Représente un point unique sur le graphique du tableau de bord
     */
    public static class MetricPoint {
        private Long timestamp; // Temps au format Unix
        private String value;     // Valeur mesurée (ex: "45.2" pour % de CPU)

        public MetricPoint(Long timestamp, String value) {
            this.timestamp = timestamp;
            this.value = value;
        }

        public Long getTimestamp() { return timestamp; }
        public void setTimestamp(Long timestamp) { this.timestamp = timestamp; }
        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }
}