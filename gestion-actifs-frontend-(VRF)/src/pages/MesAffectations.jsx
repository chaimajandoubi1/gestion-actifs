import { useEffect, useState } from "react";
import api from "../services/api";

function MesAffectations() {

    const [affectations, setAffectations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState("");

    const utilisateur = JSON.parse(
        localStorage.getItem("utilisateur")
    );

    useEffect(() => {

        const chargerAffectations = async () => {

            try {

                if (!utilisateur?.email) {
                    setErreur("Utilisateur non connecté.");
                    return;
                }

                const response = await api.get(
                    `/affectations/utilisateur/email/${encodeURIComponent(
                        utilisateur.email
                    )}`
                );

                setAffectations(response.data);

            } catch (error) {

                console.error(
                    "Erreur affectations :",
                    error
                );

                if (error.response?.status === 401) {
                    setErreur(
                        "Votre session a expiré."
                    );
                } else {
                    setErreur(
                        "Impossible de récupérer vos affectations."
                    );
                }

            } finally {

                setLoading(false);
            }
        };

        chargerAffectations();

    }, []);

    if (loading) {

        return (
            <div className="container mt-4">
                <div className="text-center">
                    Chargement...
                </div>
            </div>
        );
    }

    return (

        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>
                    <h2>Mes affectations</h2>

                    <p className="text-muted">
                        Les actifs qui vous sont affectés
                    </p>
                </div>

            </div>

            {erreur && (
                <div className="alert alert-danger">
                    {erreur}
                </div>
            )}

            {!erreur && affectations.length === 0 && (

                <div className="alert alert-info">
                    Aucun actif ne vous est actuellement affecté.
                </div>

            )}

            {affectations.length > 0 && (

                <div className="card shadow-sm">

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>
                                    <th>Actif</th>
                                    <th>Type</th>
                                    <th>Marque</th>
                                    <th>Modèle</th>
                                    <th>N° série</th>
                                    <th>Date début</th>
                                    <th>Date fin</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {affectations.map(
                                    (affectation) => {

                                        const actif =
                                            affectation.actif;

                                        return (

                                            <tr
                                                key={
                                                    affectation.id
                                                }
                                            >

                                                <td>
                                                    {actif?.nom || "-"}
                                                </td>

                                                <td>
                                                    {actif?.type || "-"}
                                                </td>

                                                <td>
                                                    {actif?.marque || "-"}
                                                </td>

                                                <td>
                                                    {actif?.modele || "-"}
                                                </td>

                                                <td>
                                                    {actif?.numeroSerie || "-"}
                                                </td>

                                                <td>
                                                    {
                                                        affectation.dateDebut
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        affectation.dateFin ||
                                                        "-"
                                                    }
                                                </td>

                                                <td>

                                                    <div className="d-flex gap-2">

                                                        <button
                                                            className="btn btn-sm btn-warning"
                                                            onClick={() =>
                                                                window.location.href =
                                                                    `/signaler-probleme/${actif?.id}`
                                                            }
                                                        >
                                                            Problème
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-success"
                                                            onClick={() =>
                                                                window.location.href =
                                                                    `/demander-licence/${actif?.id}`
                                                            }
                                                        >
                                                            Licence
                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>
    );
}

export default MesAffectations;