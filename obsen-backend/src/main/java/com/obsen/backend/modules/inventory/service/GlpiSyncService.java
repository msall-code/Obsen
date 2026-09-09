package com.obsen.backend.modules.inventory.service;

import org.springframework.stereotype.Service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class GlpiSyncService {

    public void syncGlpiData() {
        log.info("Starting GLPI data synchronization...");
    }
}