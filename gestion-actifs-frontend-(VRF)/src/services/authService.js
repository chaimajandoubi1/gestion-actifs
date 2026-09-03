
import api from "./api";

// Connecte l'utilisateur et enregistre ses informations.
export const login = async (email, motDePasse) => {

    const response = await api.post(
        "/auth/login",
        {
            email,
            motDePasse
        }
    );

    const utilisateur = response.data;

    sessionStorage.setItem(
        "token",
        utilisateur.token
    );

    sessionStorage.setItem(
        "role",
        utilisateur.role
    );

    sessionStorage.setItem(
        "utilisateur",
        JSON.stringify({
            id: utilisateur.id,
            nom: utilisateur.nom,
            email: utilisateur.email,
            role: utilisateur.role
        })
    );

    return utilisateur;
};

// Récupère le rôle de l'utilisateur connecté.
export const getRole = () => {

    return sessionStorage.getItem("role");
};

// Récupère les informations de l'utilisateur connecté.
export const getUtilisateurConnecte = () => {

    const utilisateur =
        sessionStorage.getItem("utilisateur");

    if (!utilisateur) {
        return null;
    }

    try {
        return JSON.parse(utilisateur);
    } catch {
        return null;
    }
};

// Vérifie si l'utilisateur est connecté.
export const isAuthenticated = () => {

    return !!sessionStorage.getItem("token");
};

// Déconnecte l'utilisateur.
export const logout = () => {

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
    sessionStorage.removeItem("utilisateur");
};
