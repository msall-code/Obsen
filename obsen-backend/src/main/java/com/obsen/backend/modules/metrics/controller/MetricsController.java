package com.obsen.backend.modules.metrics.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.obsen.backend.modules.metrics.dto.MetricResponseDto;
import com.obsen.backend.modules.metrics.service.PrometheusProxyService;

@RestController
@RequestMapping("/api/v1/metrics")
@CrossOrigin(origins = "http://localhost:5173") // Protection CORS validée par SonarLint
public class MetricsController {

    private final PrometheusProxyService metricsService;

    public MetricsController(PrometheusProxyService metricsService) {
        this.metricsService = metricsService;
    }

    /**
     * URL : GET /api/v1/metrics/range?jobName=serveur-dell-01&type=cpu
     */
    @GetMapping("/range")
    public ResponseEntity<MetricResponseDto> getMetrics(
            @RequestParam String jobName,
            @RequestParam String type) {
            
        MetricResponseDto response = metricsService.getAssetMetrics(jobName, type);
        return ResponseEntity.ok(response);
    }
}