
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAffectations,
    getMesAffectations,
    deleteAffectation
} from "../services/affectationService";

import { getRole } from "../services/authService";

function Affectations() {

    const navigate = useNavigate();

    const [affectations, setAffectations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState("");

    // Cette partie récupère le rôle de l'utilisateur connecté.
    const role = (getRole() || "").toUpperCase();

    // Cette partie vérifie si l'utilisateur possède le rôle administrateur.
    const isAdmin =
        role === "ADMIN" ||
        role === "ADMINISTRATEUR";

    // Cette fonction charge les affectations selon le rôle de l'utilisateur.
    const chargerAffectations = async () => {

        try {

            setLoading(true);
            setErreur("");

            let data;

            // L'administrateur peut consulter toutes les affectations.
            if (isAdmin) {

                data = await getAffectations();

            } else {

                // Les autres utilisateurs consultent uniquement leurs affectations.
                data = await getMesAffectations();
            }

            // Cette ligne permet de vérifier dans la console les données reçues du backend.
            console.log(
                "AFFECTATIONS RECUES :",
                data
            );

            // Cette partie vérifie que la réponse reçue est bien un tableau.
            setAffectations(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Erreur chargement affectations :",
                error
            );

            setErreur(
                "Impossible de charger les affectations."
            );

        } finally {

            setLoading(false);
        }
    };

    // Cette partie charge les affectations lorsque la page est ouverte.
    useEffect(() => {

        chargerAffectations();

    }, []);

    // Cette fonction supprime une affectation existante.
    const supprimer = async (id) => {

        if (
            !window.confirm(
                "Voulez-vous vraiment supprimer cette affectation ?"
            )
        ) {
            return;
        }

        try {

            await deleteAffectation(id);

            alert(
                "Affectation supprimée avec succès."
            );

            await chargerAffectations();

        } catch (error) {

            console.error(
                "Erreur suppression :",
                error
            );

            alert(
                "Impossible de supprimer l'affectation."
            );
        }
    };

    // Cette fonction ouvre le formulaire de modification de l'affectation.
    const modifier = (id) => {

        navigate(
            `/affectations/modifier/${id}`
        );
    };

    return (

        <div className="container-fluid p-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold">

                        <i className="bi bi-person-check me-2"></i>

                        Affectations

                    </h2>

                    <p className="text-muted mb-0">

                        {isAdmin
                            ? "Gestion des affectations"
                            : "Mes affectations"}

                    </p>

                </div>

                {isAdmin && (

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                            navigate(
                                "/affectations/ajouter"
                            )
                        }
                    >

                        <i className="bi bi-plus-circle me-2"></i>

                        Ajouter une affectation

                    </button>

                )}

            </div>

            {erreur && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >

                    <i className="bi bi-exclamation-triangle me-2"></i>

                    {erreur}

                </div>

            )}

            {loading ? (

                <div className="text-center p-5">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    ></div>

                    <p className="mt-3 text-muted">

                        Chargement des affectations...

                    </p>

                </div>

            ) : (

                <div className="card shadow-sm border-0">

                    <div className="card-body">

                        {affectations.length === 0 ? (

                            <div className="alert alert-info mb-0">

                                <i className="bi bi-info-circle me-2"></i>

                                Aucune affectation trouvée.

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-light">

                                        <tr>

                                            <th>Actif</th>

                                            <th>Marque</th>

                                            <th>Modèle</th>

                                            {isAdmin && (
                                                <th>Utilisateur</th>
                                            )}

                                            <th>Date début</th>

                                            <th>Date fin</th>

                                            {isAdmin && (
                                                <th className="text-center">
                                                    Actions
                                                </th>
                                            )}

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

                                                        <strong>

                                                            {affectation.actifNom || "-"}

                                                        </strong>

                                                        {affectation.actifNumeroSerie && (

                                                            <div>

                                                                <small className="text-muted">

                                                                    N° série :
                                                                    {" "}
                                                                    {affectation.actifNumeroSerie}

                                                                </small>

                                                            </div>

                                                        )}

                                                    </td>

                                                    <td>

                                                        {affectation.actifMarque || "-"}

                                                    </td>

                                                    <td>

                                                        {affectation.actifModele || "-"}

                                                    </td>

                                                    {isAdmin && (

                                                        <td>

                                                            <strong>

                                                                {affectation.utilisateurNom || "-"}

                                                            </strong>

                                                            {affectation.utilisateurEmail && (

                                                                <div>

                                                                    <small className="text-muted">

                                                                        {affectation.utilisateurEmail}

                                                                    </small>

                                                                </div>

                                                            )}

                                                        </td>

                                                    )}

                                                    <td>

                                                        {affectation.dateDebut || "-"}

                                                    </td>

                                                    <td>

                                                        {affectation.dateFin ? (

                                                            <span className="badge bg-secondary">

                                                                {affectation.dateFin}

                                                            </span>

                                                        ) : (

                                                            <span className="badge bg-success">

                                                                Active

                                                            </span>

                                                        )}

                                                    </td>

                                                    {isAdmin && (

                                                        <td className="text-center">

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-warning me-2"
                                                                title="Modifier"
                                                                onClick={() =>
                                                                    modifier(
                                                                        affectation.id
                                                                    )
                                                                }
                                                            >

                                                                <i className="bi bi-pencil"></i>

                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger"
                                                                title="Supprimer"
                                                                onClick={() =>
                                                                    supprimer(
                                                                        affectation.id
                                                                    )
                                                                }
                                                            >

                                                                <i className="bi bi-trash"></i>

                                                            </button>

                                                        </td>

                                                    )}

                                                </tr>

                                            )
                                        )}

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

export default Affectations;

