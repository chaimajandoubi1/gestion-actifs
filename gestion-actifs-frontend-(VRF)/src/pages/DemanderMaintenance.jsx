import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getActifs } from "../services/actifService";
import {
    signalerProbleme,
    getMesDemandesMaintenance
} from "../services/demandeMaintenanceService";

// Vue affichée sur la page "Maintenances" lorsque l'utilisateur connecté
// a le rôle UTILISATEUR : au lieu du tableau de gestion réservé à
// l'Admin/Technicien, il obtient un formulaire pour signaler un problème
// sur l'un de ses actifs, ainsi que l'historique de ses propres demandes.
function DemanderMaintenance() {

    const navigate = useNavigate();

    const [actifs, setActifs] = useState([]);
    const [mesDemandes, setMesDemandes] = useState([]);

    const [actifId, setActifId] = useState("");
    const [description, setDescription] = useState("");

    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState("");
    const [succes, setSucces] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const charger = async () => {

            try {

                setLoading(true);

                const [actifsData, demandesResponse] =
                    await Promise.all([
                        getActifs(),
                        getMesDemandesMaintenance()
                    ]);

                setActifs(actifsData);
                setMesDemandes(demandesResponse.data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);
            }
        };

        charger();

    }, []);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!actifId) {
            setErreur("Merci de sélectionner un actif.");
            return;
        }

        if (!description.trim()) {
            setErreur("Merci de décrire le problème rencontré.");
            return;
        }

        try {

            setEnvoi(true);
            setErreur("");

            const reponse = await signalerProbleme({
                actifId,
                description: description.trim()
            });

            setSucces(true);
            setDescription("");
            setActifId("");

            setMesDemandes((prev) => [reponse.data, ...prev]);

        } catch (error) {

            console.error(error);

            setErreur(
                error.response?.data?.message ||
                "Impossible d'envoyer votre signalement. Veuillez réessayer."
            );

        } finally {

            setEnvoi(false);
        }
    };

    const badgeStatut = (statut) => {

        const classes = {
            EN_ATTENTE: "bg-secondary-subtle",
            EN_COURS: "bg-warning-subtle text-warning-emphasis",
            TRAITEE: "bg-success-subtle",
            REJETEE: "bg-danger-subtle"
        };

        return classes[statut] || "bg-secondary-subtle";
    };

    return (

        <div className="container-fluid p-4">

            <div className="d-flex align-items-center justify-content-between mb-4">

                <h2 className="mb-0">
                    Signaler une maintenance
                </h2>

                <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate("/espace-utilisateur")}
                >
                    <i className="bi bi-arrow-left me-1"></i>
                    Retour
                </button>

            </div>

            <div className="card shadow-sm mb-4">

                <div className="card-header">
                    <h5 className="mb-0">Nouveau signalement</h5>
                </div>

                <div className="card-body">

                    {succes && (
                        <div className="alert alert-success">
                            <i className="bi bi-check-circle me-2"></i>
                            Votre signalement a bien été envoyé. Un
                            technicien va le traiter prochainement.
                        </div>
                    )}

                    {erreur && (
                        <div className="alert alert-danger">
                            {erreur}
                        </div>
                    )}

                    {actifs.length === 0 && !loading ? (

                        <div className="alert alert-info mb-0">
                            Aucun actif ne vous est actuellement affecté :
                            vous ne pouvez donc pas signaler de problème.
                        </div>

                    ) : (

                        <form onSubmit={handleSubmit}>

                            <div className="row g-3">

                                <div className="col-md-4">

                                    <label className="form-label">
                                        Actif concerné
                                    </label>

                                    <select
                                        className="form-select"
                                        value={actifId}
                                        onChange={(e) =>
                                            setActifId(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Sélectionner un actif...
                                        </option>

                                        {actifs.map((actif) => (
                                            <option
                                                key={actif.id}
                                                value={actif.id}
                                            >
                                                {actif.nom}
                                                {actif.numeroSerie
                                                    ? ` (${actif.numeroSerie})`
                                                    : ""}
                                            </option>
                                        ))}

                                    </select>

                                </div>

                                <div className="col-md-8">

                                    <label className="form-label">
                                        Description du problème
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        placeholder="Décrivez le problème rencontré..."
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                    ></textarea>

                                </div>

                            </div>

                            <div className="mt-3">

                                <button
                                    type="submit"
                                    className="btn btn-warning"
                                    disabled={envoi}
                                >
                                    <i className="bi bi-send me-1"></i>
                                    {envoi ? "Envoi..." : "Envoyer le signalement"}
                                </button>

                            </div>

                        </form>

                    )}

                </div>

            </div>

            <div className="card shadow-sm">

                <div className="card-header">
                    <h5 className="mb-0">Mes signalements</h5>
                </div>

                <div className="card-body">

                    {loading ? (

                        <p>Chargement...</p>

                    ) : mesDemandes.length === 0 ? (

                        <div className="alert alert-info mb-0">
                            Vous n'avez encore signalé aucun problème.
                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover">

                                <thead>
                                    <tr>
                                        <th>Actif</th>
                                        <th>Description</th>
                                        <th>Date</th>
                                        <th>Statut</th>
                                        <th>Commentaire</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {mesDemandes.map((demande) => (
                                        <tr key={demande.id}>
                                            <td>
                                                {demande.actif?.nom}
                                            </td>
                                            <td>{demande.description}</td>
                                            <td>
                                                {demande.dateCreation
                                                    ? new Date(demande.dateCreation)
                                                        .toLocaleDateString()
                                                    : "-"}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${badgeStatut(demande.statut)}`}
                                                >
                                                    {demande.statut}
                                                </span>
                                            </td>
                                            <td>
                                                {demande.commentaireTraitement || "-"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default DemanderMaintenance;
