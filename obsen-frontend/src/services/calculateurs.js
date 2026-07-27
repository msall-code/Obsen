/**
 * Valide si une chaîne est une adresse IPv4 valide de manière simple et sécurisée.
 * @param {string} ip 
 * @returns {boolean}
 */
export function validerAdresseIP(ip) {
  // Regex IPv4 simplifiée et conforme aux critères de complexité SonarLint
  const regexIPv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = regexIPv4.exec(ip);
  if (!match) return false;

  // Résolution S7773 : Remplacement de parseInt par Number.parseInt
  return match.slice(1).every(octet => {
    const valeur = Number.parseInt(octet, 10);
    return valeur >= 0 && valeur <= 255;
  });
}

/**
 * Calcule l'état de santé général du parc en pourcentage (0-100) basé sur l'usage CPU/RAM.
 * @param {Array} equipements 
 * @returns {number}
 */
export function calculerSanteParc(equipements) {
  if (!equipements || equipements.length === 0) return 100;
  
  const scoreTotal = equipements.reduce((acc, eq) => {
    const cpuSurcharge = eq.metriques?.cpu > 85 ? 50 : 0;
    const ramSurcharge = eq.metriques?.ram > 85 ? 50 : 0;
    return acc + (100 - cpuSurcharge - ramSurcharge);
  }, 0);

  return Math.round(scoreTotal / equipements.length);
}