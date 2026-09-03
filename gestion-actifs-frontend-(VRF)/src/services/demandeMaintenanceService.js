import api from "./api";

// Cette fonction récupère toutes les demandes de maintenance (ADMIN, TECHNICIEN).
export const getDemandesMaintenance = () =>
    api.get("/demandes-maintenance");

// Cette fonction récupère les demandes de maintenance de l'utilisateur connecté.
export const getMesDemandesMaintenance = () =>
    api.get("/demandes-maintenance/mes-demandes");

// Cette fonction signale un problème sur un actif (création d'une demande).
export const signalerProbleme = (demande) =>
    api.post("/demandes-maintenance", demande);

// Cette fonction permet à l'administrateur / au technicien de traiter une demande.
export const traiterDemandeMaintenance = (id, traitement) =>
    api.put(`/demandes-maintenance/${id}/traiter`, traitement);

// Cette fonction supprime une demande de maintenance (ADMIN).
export const deleteDemandeMaintenance = (id) =>
    api.delete(`/demandes-maintenance/${id}`);
