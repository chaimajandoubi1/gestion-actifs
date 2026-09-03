import api from "./api";

// Cette fonction récupère toutes les demandes de licence (ADMIN, TECHNICIEN).
export const getDemandesLicence = () =>
    api.get("/demandes-licence");

// Cette fonction récupère les demandes de licence de l'utilisateur connecté.
export const getMesDemandesLicence = () =>
    api.get("/demandes-licence/mes-demandes");

// Cette fonction crée une nouvelle demande de licence.
export const demanderLicence = (demande) =>
    api.post("/demandes-licence", demande);

// Cette fonction permet à l'administrateur / au technicien de traiter une demande.
export const traiterDemandeLicence = (id, traitement) =>
    api.put(`/demandes-licence/${id}/traiter`, traitement);

// Cette fonction supprime une demande de licence (ADMIN).
export const deleteDemandeLicence = (id) =>
    api.delete(`/demandes-licence/${id}`);
