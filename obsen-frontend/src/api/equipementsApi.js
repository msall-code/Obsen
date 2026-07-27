import axios from 'axios';

// 1. Création d'une instance Axios dédiée à Obsen
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    timeout: 10000, // Coupe la requête après 10 secondes si le Back ne répond pas
    headers: {
        'Content-Type': 'application/json'
    }
});

// 2. Intercepteur : On injecte automatiquement le X-Tenant-ID à chaque requête !
api.interceptors.request.use(
    (config) => {
        config.headers['X-Tenant-ID'] = 'default-startup-tenant';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Déclaration des services
export const monitoringApi = {
    /**
     * Récupère la topologie complète du datacenter (serveurs et applications)
     */
    fetchDatacenters: async () => {
        try {
            // Axios extrait déjà le corps de la réponse dans l'objet .data
            const response = await api.get('/inventory/datacenters');
            return response.data;
        } catch (error) {
            console.error("❌ Erreur Axios lors du chargement de l'inventaire:", error.response?.data || error.message);
            return [];
        }
    },

    /**
     * Récupère les points du graphique en temps réel pour un composant précis
     */
    fetchMetrics: async (jobName, metricType) => {
        try {
            const response = await api.get('/metrics/range', {
                params: {
                    jobName: jobName,
                    type: metricType
                }
            });
            return response.data;
        } catch (error) {
            console.error(`❌ Erreur Axios métriques [${metricType}]:`, error.response?.data || error.message);
            return { status: "error", data: [] };
        }
    }
};