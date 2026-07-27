-- 1. Création du Datacenter Principal de la Startup (Sous notre tag default-startup-tenant)
INSERT INTO datacenters (id, name, location, tenant_id) 
VALUES (1, 'Dakar DataCenter - Tier III', 'Zone Franche, Diamniadio', 'default-startup-tenant')
ON CONFLICT (id) DO NOTHING;

-- 2. Création de la Topologie des Assets à surveiller
-- Serveur Physique Linux (Hardware)
INSERT INTO datacenter_assets (id, name, type, ip_address, status, metrics_job_name, datacenter_id)
VALUES (1, 'srv-linux-prod-01', 'HARDWARE', '10.0.1.5', 'UP', 'node-exporter-prod', 1)
ON CONFLICT (id) DO NOTHING;

-- L'API Web de Production (Software)
INSERT INTO datacenter_assets (id, name, type, ip_address, status, metrics_job_name, datacenter_id)
VALUES (2, 'obsen-main-api', 'SOFTWARE', '10.0.2.10', 'WARNING', 'spring-boot-actuator', 1)
ON CONFLICT (id) DO NOTHING;

-- La Base de données PostgreSQL (Software)
INSERT INTO datacenter_assets (id, name, type, ip_address, status, metrics_job_name, datacenter_id)
VALUES (3, 'postgres-cluster-db', 'SOFTWARE', '10.0.2.11', 'UP', 'postgres-exporter', 1)
ON CONFLICT (id) DO NOTHING;