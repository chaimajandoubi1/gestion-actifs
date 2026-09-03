import api from "./api";

export const getUtilisateurs = () => {
    return api.get("/utilisateurs");
};

export const getUtilisateurById = (id) => {
    return api.get(`/utilisateurs/${id}`);
};

export const createUtilisateur = (utilisateur) => {
    return api.post("/utilisateurs", utilisateur);
};

export const updateUtilisateur = (id, utilisateur) => {
    return api.put(`/utilisateurs/${id}`, utilisateur);
};

export const deleteUtilisateur = (id) => {
    return api.delete(`/utilisateurs/${id}`);
};