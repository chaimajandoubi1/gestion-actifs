
import axios from "axios";

const api = axios.create({

    baseURL: "http://localhost:8081/api",

    headers: {
        "Content-Type": "application/json"
    }

});

// Ajoute automatiquement le JWT aux requêtes.
api.interceptors.request.use(

    (config) => {

        const token =
            sessionStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);

// Gère les erreurs d'authentification.
api.interceptors.response.use(

    (response) => {

        return response;
    },

    (error) => {

        if (error.response?.status === 401) {

            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");
            sessionStorage.removeItem("utilisateur");

            if (
                window.location.pathname !== "/login"
            ) {

                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
