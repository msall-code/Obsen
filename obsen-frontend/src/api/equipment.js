// Données initiales d'inventaire
export const INITIAL_EQUIPMENT_INVENTORY = [
  {
    id: "EQ-001",
    nodeName: "SRV-OBSEN-01",
    category: "COMPUTE",
    status: "ACTIVE",
    ipAddress: "192.168.10.12",
    macAddress: "00:1A:2B:3C:4D:5E",
    location: "Salle Serveur A - Baie 01",
    lastMaintenance: "2024-11-15"
  },
  {
    id: "EQ-002",
    nodeName: "SW-CORE-01",
    category: "NETWORK",
    status: "ACTIVE",
    ipAddress: "192.168.10.1",
    macAddress: "00:1A:2B:3C:4D:5F",
    location: "Salle Serveur A - Baie 02",
    lastMaintenance: "2024-10-01"
  },
  {
    id: "EQ-003",
    nodeName: "UPS-MAIN-01",
    category: "ELECTRICAL",
    status: "WARNING",
    ipAddress: "192.168.10.250",
    macAddress: "00:1A:2B:3C:4D:60",
    location: "Local Technique - Rez-de-chaussée",
    lastMaintenance: "2024-08-20"
  }
];

// Variable en mémoire pour simuler la base de données locale en l'absence de backend connecté
let localInventory = [...INITIAL_EQUIPMENT_INVENTORY];

/**
 * Récupère tous les équipements
 */
export const getAllEquipments = async () => {
  try {
    // Si une API backend est disponible, décommentez la ligne fetch :
    // const response = await fetch('/api/equipments');
    // return await response.json();

    return Promise.resolve(localInventory);
  } catch (error) {
    console.error("Erreur lors de la récupération des équipements :", error);
    return Promise.resolve(localInventory);
  }
};

// Alias d'exportation pour assurer la compatibilité ascendante
export const getEquipments = getAllEquipments;

/**
 * Ajoute un nouvel équipement
 */
export const createEquipment = async (equipmentData) => {
  const newEquipment = {
    ...equipmentData,
    id: equipmentData.id || `EQ-00${localInventory.length + 1}`
  };
  localInventory = [newEquipment, ...localInventory];
  return Promise.resolve(newEquipment);
};

/**
 * Met à jour un équipement existant
 */
export const updateEquipment = async (id, equipmentData) => {
  localInventory = localInventory.map((item) =>
    item.id === id ? { ...item, ...equipmentData } : item
  );
  return Promise.resolve({ id, ...equipmentData });
};

/**
 * Supprime un équipement par son ID
 */
export const deleteEquipment = async (id) => {
  localInventory = localInventory.filter((item) => item.id !== id);
  return Promise.resolve({ success: true, id });
};