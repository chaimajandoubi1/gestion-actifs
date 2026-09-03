import api from "./api";

// Cette fonction récupère toutes les demandes d'actif (ADMIN, TECHNICIEN).
export const getDemandesActif = () =>
    api.get("/demandes-actif");

// Cette fonction récupère les demandes d'actif de l'utilisateur connecté.
export const getMesDemandesActif = () =>
    api.get("/demandes-actif/mes-demandes");

// Cette fonction crée une nouvelle demande d'actif.
export const demanderActif = (demande) =>
    api.post("/demandes-actif", demande);

// Cette fonction permet à l'administrateur / au technicien de traiter une demande.
export const traiterDemandeActif = (id, traitement) =>
    api.put(`/demandes-actif/${id}/traiter`, traitement);

// Cette fonction supprime une demande d'actif (ADMIN).
export const deleteDemandeActif = (id) =>
    api.delete(`/demandes-actif/${id}`);
