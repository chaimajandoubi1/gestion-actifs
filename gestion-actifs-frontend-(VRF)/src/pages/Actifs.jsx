
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getActifs,
    deleteActif,
    getMesActifsParCategorie
} from "../services/actifService";

import api from "../services/api";
import { getRole } from "../services/authService";

function Actifs() {

    const navigate = useNavigate();

    const [actifs, setActifs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categorieId, setCategorieId] = useState("");
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState("");

    const role = (
        getRole() || ""
    ).toUpperCase();

    const isAdmin =
        role === "ADMIN" ||
        role === "ADMINISTRATEUR";

    const isUtilisateur =
        role === "UTILISATEUR";

    const chargerActifs = async () => {

        try {

            setLoading(true);
            setErreur("");

            const data = await getActifs();

            setActifs(data);

        } catch (error) {

            console.error(error);

            setErreur(
                "Impossible de charger les actifs."
            );

        } finally {

            setLoading(false);
        }
    };

    const chargerCategories = async () => {

        try {

            const response =
                await api.get("/categories");

            setCategories(response.data);

        } catch (error) {

            console.error(error);
        }
    };

    useEffect(() => {

        chargerActifs();
        chargerCategories();

    }, []);

    const filtrerCategorie = async (id) => {

        setCategorieId(id);
        setErreur("");

        if (!id) {

            chargerActifs();

            return;
        }

        if (isUtilisateur) {

            try {

                setLoading(true);

                const data =
                    await getMesActifsParCategorie(id);

                setActifs(data);

            } catch (error) {

                console.error(error);

                setErreur(
                    "Erreur lors du filtrage."
                );

            } finally {

                setLoading(false);
            }

            return;
        }

        try {

            setLoading(true);

            const data =
                await getActifs();

            const filtres =
                data.filter(
                    actif =>
                        actif.categorie?.id === Number(id)
                );

            setActifs(filtres);

        } catch (error) {

            console.error(error);

            setErreur(
                "Erreur lors du filtrage."
            );

        } finally {

            setLoading(false);
        }
    };

    const supprimer = async (id) => {

        if (
            !window.confirm(
                "Voulez-vous vraiment supprimer cet actif ?"
            )
        ) {
            return;
        }

        try {

            await deleteActif(id);

            await chargerActifs();

        } catch (error) {

            console.error(error);

            alert(
                "Impossible de supprimer cet actif."
            );
        }
    };

    const modifier = (id) => {

        navigate(
            `/actifs/modifier/${id}`
        );
    };

    return (

        <div className="container-fluid p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2>
                        <i className="bi bi-laptop me-2"></i>
                        Actifs
                    </h2>

                    <p className="text-muted">

                        {isAdmin
                            ? "Gestion de tous les actifs"
                            : role === "TECHNICIEN"
                            ? "Consultation de tous les actifs"
                            : "Mes actifs affectés"}

                    </p>

                </div>

                {isAdmin && (

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            navigate("/actifs/ajouter")
                        }
                    >

                        <i className="bi bi-plus-circle me-2"></i>

                        Ajouter un actif

                    </button>

                )}

            </div>

            {erreur && (

                <div className="alert alert-danger">
                    {erreur}
                </div>

            )}

            <div className="card shadow-sm mb-4">

                <div className="card-body">

                    <label className="form-label">
                        Filtrer par catégorie
                    </label>

                    <select
                        className="form-select"
                        value={categorieId}
                        onChange={(e) =>
                            filtrerCategorie(
                                e.target.value
                            )
                        }
                    >

                        <option value="">
                            Toutes les catégories
                        </option>

                        {categories.map(categorie => (

                            <option
                                key={categorie.id}
                                value={categorie.id}
                            >
                                {categorie.nom}
                            </option>

                        ))}

                    </select>

                </div>

            </div>

            {loading ? (

                <div className="text-center p-5">

                    <div
                        className="spinner-border text-primary"
                    />

                    <p className="mt-2">
                        Chargement...
                    </p>

                </div>

            ) : (

                <div className="card shadow-sm">

                    <div className="card-body">

                        {actifs.length === 0 ? (

                            <div className="alert alert-info">
                                Aucun actif trouvé.
                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover">

                                    <thead>

                                        <tr>

                                            <th>Nom</th>
                                            <th>Type</th>
                                            <th>Marque</th>
                                            <th>Modèle</th>
                                            <th>N° série</th>
                                            <th>Statut</th>
                                            <th>Catégorie</th>

                                            {isAdmin && (
                                                <th>Actions</th>
                                            )}

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {actifs.map(actif => (

                                            <tr
                                                key={actif.id}
                                            >

                                                <td>
                                                    {actif.nom}
                                                </td>

                                                <td>
                                                    {actif.type}
                                                </td>

                                                <td>
                                                    {actif.marque}
                                                </td>

                                                <td>
                                                    {actif.modele}
                                                </td>

                                                <td>
                                                    {actif.numeroSerie}
                                                </td>

                                                <td>

                                                    <span className="badge bg-primary">
                                                        {actif.statut}
                                                    </span>

                                                </td>

                                                <td>
                                                    {actif.categorie?.nom}
                                                </td>

                                                {isAdmin && (

                                                    <td>

                                                        <div className="d-flex gap-2">

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-warning"
                                                                onClick={() =>
                                                                    modifier(
                                                                        actif.id
                                                                    )
                                                                }
                                                                title="Modifier"
                                                            >

                                                                <i className="bi bi-pencil"></i>

                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                onClick={() =>
                                                                    supprimer(
                                                                        actif.id
                                                                    )
                                                                }
                                                                title="Supprimer"
                                                            >

                                                                <i className="bi bi-trash"></i>

                                                            </button>

                                                        </div>

                                                    </td>

                                                )}

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default Actifs;
