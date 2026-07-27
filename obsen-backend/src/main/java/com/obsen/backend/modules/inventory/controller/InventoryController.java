package com.obsen.backend.modules.inventory.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.obsen.backend.modules.inventory.dto.DatacenterDto;
import com.obsen.backend.modules.inventory.service.InventoryService;

@RestController
@RequestMapping("/api/v1/inventory")
// CORRECTION : Sécurisation CORS en ciblant l'adresse locale du Frontend React au lieu de "*"
@CrossOrigin(origins = "http://localhost:5173") 
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping("/datacenters")
    public ResponseEntity<List<DatacenterDto>> getDatacenters() {
        List<DatacenterDto> datacenters = inventoryService.getAllDatacentersForCurrentTenant();
        return ResponseEntity.ok(datacenters);
    }
}