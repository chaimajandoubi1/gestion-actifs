import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getLicences } from "../services/licenceService";
import {
    demanderLicence,
    getMesDemandesLicence
} from "../services/demandeLicenceService";

// Cette page permet à un utilisateur de demander l'accès à une licence
// existante dans le catalogue. La demande est ensuite traitée par
// l'administrateur ou le technicien depuis la page "Demandes".
function DemanderLicence() {

    const navigate = useNavigate();

    const [licences, setLicences] = useState([]);
    const [mesDemandes, setMesDemandes] = useState([]);

    const [licenceId, setLicenceId] = useState("");
    const [description, setDescription] = useState("");

    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState("");
    const [succes, setSucces] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const charger = async () => {

            try {

                setLoading(true);

                const [licencesResponse, demandesResponse] =
                    await Promise.all([
                        getLicences(),
                        getMesDemandesLicence()
                    ]);

                setLicences(licencesResponse.data);
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

        if (!licenceId) {
            setErreur("Merci de sélectionner une licence.");
            return;
        }

        try {

            setEnvoi(true);
            setErreur("");

            const reponse = await demanderLicence({
                licenceId,
                description: description.trim() || null
            });

            setSucces(true);
            setDescription("");
            setLicenceId("");

            setMesDemandes((prev) => [reponse.data, ...prev]);

        } catch (error) {

            console.error(error);

            setErreur(
                error.response?.data?.message ||
                "Impossible d'envoyer votre demande. Veuillez réessayer."
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
                    Demander une licence
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
                    <h5 className="mb-0">Nouvelle demande</h5>
                </div>

                <div className="card-body">

                    {succes && (
                        <div className="alert alert-success">
                            <i className="bi bi-check-circle me-2"></i>
                            Votre demande a bien été envoyée. Elle sera
                            examinée par l'administrateur ou le technicien.
                        </div>
                    )}

                    {erreur && (
                        <div className="alert alert-danger">
                            {erreur}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="row g-3">

                            <div className="col-md-4">

                                <label className="form-label">
                                    Licence souhaitée
                                </label>

                                <select
                                    className="form-select"
                                    value={licenceId}
                                    onChange={(e) =>
                                        setLicenceId(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Sélectionner une licence...
                                    </option>

                                    {licences.map((licence) => (
                                        <option
                                            key={licence.id}
                                            value={licence.id}
                                        >
                                            {licence.nom} ({licence.editeur})
                                        </option>
                                    ))}

                                </select>

                            </div>

                            <div className="col-md-8">

                                <label className="form-label">
                                    Justification (facultatif)
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Ex : Besoin de ce logiciel pour le projet X..."
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
                                className="btn btn-primary"
                                disabled={envoi}
                            >
                                <i className="bi bi-send me-1"></i>
                                {envoi ? "Envoi..." : "Envoyer la demande"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

            <div className="card shadow-sm">

                <div className="card-header">
                    <h5 className="mb-0">Mes demandes de licence</h5>
                </div>

                <div className="card-body">

                    {loading ? (

                        <p>Chargement...</p>

                    ) : mesDemandes.length === 0 ? (

                        <div className="alert alert-info mb-0">
                            Vous n'avez encore effectué aucune demande.
                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover">

                                <thead>
                                    <tr>
                                        <th>Licence</th>
                                        <th>Justification</th>
                                        <th>Date</th>
                                        <th>Statut</th>
                                        <th>Commentaire</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {mesDemandes.map((demande) => (
                                        <tr key={demande.id}>
                                            <td>
                                                {demande.licence?.nom || "-"}
                                            </td>
                                            <td>{demande.description || "-"}</td>
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

export default DemanderLicence;
