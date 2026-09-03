import api from "./api";

// Cette fonction récupère toutes les affectations enregistrées.
export const getAffectations = async () => {
    const response = await api.get("/affectations");
    return response.data;
};

// Cette fonction récupère uniquement les affectations de l'utilisateur connecté.
export const getMesAffectations = async () => {
    const response = await api.get(
        "/affectations/mes-affectations"
    );

    return response.data;
};

// Cette fonction récupère une affectation précise grâce à son identifiant.
export const getAffectationById = async (id) => {
    const response = await api.get(
        `/affectations/${id}`
    );

    return response.data;
};

// Cette fonction ajoute une nouvelle affectation.
export const ajouterAffectation = async (affectation) => {
    const response = await api.post(
        "/affectations",
        affectation
    );

    return response.data;
};

// Cette fonction modifie une affectation existante.
export const modifierAffectation = async (
    id,
    affectation
) => {
    const response = await api.put(
        `/affectations/${id}`,
        affectation
    );

    return response.data;
};

// Cette fonction supprime une affectation existante.
export const deleteAffectation = async (id) => {
    const response = await api.delete(
        `/affectations/${id}`
    );

    return response.data;
};