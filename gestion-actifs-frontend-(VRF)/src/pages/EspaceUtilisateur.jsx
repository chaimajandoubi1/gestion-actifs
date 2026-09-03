import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    getActifs,
    getMesActifsParCategorie
} from "../services/actifService";

import { getMesAffectations } from "../services/affectationService";
import { getCategories } from "../services/categorieService";

import SignalerProbleme from "./SignalerProbleme";

function EspaceUtilisateur() {

    const [actifs, setActifs] = useState([]);
    const [affectations, setAffectations] = useState([]);
    const [categories, setCategories] = useState([]);

    const [categorieId, setCategorieId] = useState("");

    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState("");

    // Actif pour lequel la fenêtre "Signaler un problème" est ouverte.
    const [actifSignalement, setActifSignalement] = useState(null);
    const [messageSucces, setMessageSucces] = useState("");

    // =====================================================
    // CHARGER LES CATÉGORIES
    // =====================================================

    const chargerCategories = async () => {

        try {

            const data = await getCategories();
            setCategories(data);

        } catch (error) {

            console.error(error);
            // Le filtre reste simplement vide si les catégories
            // ne peuvent pas être chargées ; ce n'est pas bloquant.
        }
    };

    // =====================================================
    // CHARGER LES ACTIFS
    // =====================================================

    const chargerActifs = async () => {

        try {

            setLoading(true);
            setErreur("");

            let data;

            if (categorieId) {

                data = await getMesActifsParCategorie(
                    categorieId
                );

            } else {

                data = await getActifs();

            }

            setActifs(data);

        } catch (error) {

            console.error(error);

            setErreur(
                "Impossible de charger vos actifs."
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // CHARGER LES AFFECTATIONS
    // =====================================================

    const chargerAffectations = async () => {

        try {

            const data =
                await getMesAffectations();

            setAffectations(data);

        } catch (error) {

            console.error(error);

            setErreur(
                "Impossible de charger vos affectations."
            );
        }
    };

    // =====================================================
    // INITIALISATION
    // =====================================================

    useEffect(() => {

        chargerCategories();
        chargerActifs();
        chargerAffectations();

    }, []);

    // =====================================================
    // FILTRE
    // =====================================================

    useEffect(() => {

        chargerActifs();

    }, [categorieId]);

    // =====================================================
    // SIGNALEMENT D'UN PROBLÈME
    // =====================================================

    const handleSignalementReussi = () => {

        setMessageSucces(
            "Votre signalement a bien été envoyé."
        );

        setTimeout(() => setMessageSucces(""), 5000);
    };

    // =====================================================
    // AFFICHAGE
    // =====================================================

    return (

        <div className="container-fluid p-4">

            <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">

                <h2 className="mb-0">
                    Mon espace
                </h2>

                <div className="d-flex gap-2 flex-wrap">

                    <Link
                        to="/demande-actif"
                        className="btn btn-outline-primary btn-sm"
                    >
                        <i className="bi bi-plus-circle me-1"></i>
                        Demander un actif
                    </Link>

                    <Link
                        to="/maintenances"
                        className="btn btn-outline-warning btn-sm"
                    >
                        <i className="bi bi-tools me-1"></i>
                        Signaler une maintenance
                    </Link>

                    <Link
                        to="/demander-licence"
                        className="btn btn-outline-primary btn-sm"
                    >
                        <i className="bi bi-key me-1"></i>
                        Demander une licence
                    </Link>

                </div>

            </div>

            {messageSucces && (
                <div className="alert alert-success">
                    {messageSucces}
                </div>
            )}

            {erreur && (
                <div className="alert alert-danger">
                    {erreur}
                </div>
            )}

            {/* =================================================
                MES ACTIFS
            ================================================= */}

            <div className="card shadow-sm mb-4">

                <div className="card-header">

                    <h5 className="mb-0">
                        Mes actifs
                    </h5>

                </div>

                <div className="card-body">

                    {/* FILTRE */}

                    <div className="row mb-4">

                        <div className="col-md-4">

                            <label className="form-label">
                                Filtrer par catégorie
                            </label>

                            <select
                                className="form-select"
                                value={categorieId}
                                onChange={(e) =>
                                    setCategorieId(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Toutes les catégories
                                </option>

                                {categories.map((categorie) => (

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

                    {/* TABLE */}

                    {loading ? (

                        <p>
                            Chargement...
                        </p>

                    ) : actifs.length === 0 ? (

                        <div className="alert alert-info">
                            Aucun actif ne vous est actuellement affecté.
                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover">

                                <thead>

                                    <tr>

                                        <th>
                                            Nom
                                        </th>

                                        <th>
                                            Type
                                        </th>

                                        <th>
                                            Marque
                                        </th>

                                        <th>
                                            Modèle
                                        </th>

                                        <th>
                                            N° série
                                        </th>

                                        <th>
                                            Statut
                                        </th>

                                        <th>
                                            Catégorie
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {actifs.map((actif) => (

                                        <tr key={actif.id}>

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

                                            <td>

                                                <button
                                                    className="btn btn-warning btn-sm me-2"
                                                    onClick={() =>
                                                        setActifSignalement(actif)
                                                    }
                                                >
                                                    <i className="bi bi-tools"></i>
                                                    {" "}
                                                    Problème
                                                </button>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

            {/* =================================================
                MES AFFECTATIONS
            ================================================= */}

            <div className="card shadow-sm">

                <div className="card-header">

                    <h5 className="mb-0">
                        Mes affectations
                    </h5>

                </div>

                <div className="card-body">

                    {affectations.length === 0 ? (

                        <div className="alert alert-info">
                            Aucune affectation trouvée.
                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover">

                                <thead>

                                    <tr>

                                        <th>
                                            Actif
                                        </th>

                                        <th>
                                            Marque
                                        </th>

                                        <th>
                                            Modèle
                                        </th>

                                        <th>
                                            Date début
                                        </th>

                                        <th>
                                            Date fin
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {affectations.map(
                                        (affectation) => (

                                            <tr
                                                key={
                                                    affectation.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        affectation
                                                            .actifNom
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        affectation
                                                            .actifMarque
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        affectation
                                                            .actifModele
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        affectation
                                                            .dateDebut
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        affectation
                                                            .dateFin ||
                                                        "-"
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

            {/* =================================================
                FENÊTRE SIGNALER UN PROBLÈME
            ================================================= */}

            {actifSignalement && (

                <SignalerProbleme
                    actif={actifSignalement}
                    onClose={() => setActifSignalement(null)}
                    onSuccess={handleSignalementReussi}
                />

            )}

        </div>
    );
}

export default EspaceUtilisateur;
