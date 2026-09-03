import api from "./api";

export const getActifs = async () => {

    const response = await api.get("/actifs");

    return response.data;
};

export const getActifById = async (id) => {

    const response =
        await api.get(`/actifs/${id}`);

    return response.data;
};

export const getMesActifsParCategorie = async (
    categorieId
) => {

    const response =
        await api.get(
            `/actifs/mes-actifs/categorie/${categorieId}`
        );

    return response.data;
};

export const createActif = async (actif) => {

    const response =
        await api.post("/actifs", actif);

    return response.data;
};

export const updateActif = async (
    id,
    actif
) => {

    const response =
        await api.put(
            `/actifs/${id}`,
            actif
        );

    return response.data;
};

export const deleteActif = async (id) => {

    const response =
        await api.delete(
            `/actifs/${id}`
        );

    return response.data;
};