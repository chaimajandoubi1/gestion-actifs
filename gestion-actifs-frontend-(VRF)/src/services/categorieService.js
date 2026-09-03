import api from "./api";

// Récupérer toutes les catégories
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// Ajouter une catégorie
export const ajouterCategorie = async (categorie) => {
  const response = await api.post("/categories", categorie);
  return response.data;
};

// Modifier une catégorie
export const modifierCategorie = async (id, categorie) => {
  const response = await api.put(`/categories/${id}`, categorie);
  return response.data;
};

// Supprimer une catégorie
export const supprimerCategorie = async (id) => {
  await api.delete(`/categories/${id}`);
};