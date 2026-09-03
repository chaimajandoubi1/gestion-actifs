import { useState } from "react";
import { signalerProbleme } from "../services/demandeMaintenanceService";

// Fenêtre modale permettant à un utilisateur de signaler un problème
// sur un actif qui lui est affecté. Elle crée une DemandeMaintenance
// côté backend (statut initial : EN_ATTENTE).
function SignalerProbleme({ actif, onClose, onSuccess }) {

    const [description, setDescription] = useState("");
    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState("");
    const [succes, setSucces] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!description.trim()) {
            setErreur("Merci de décrire le problème rencontré.");
            return;
        }

        try {

            setEnvoi(true);
            setErreur("");

            await signalerProbleme({
                actifId: actif.id,
                description: description.trim(),
            });

            setSucces(true);

            if (onSuccess) {
                onSuccess();
            }

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

    return (
        <div
            className="modal fade show d-block bg-dark bg-opacity-50"
            tabIndex="-1"
            role="dialog"
        >
            <div className="modal-dialog modal-dialog-centered">

                <div className="modal-content shadow border-0">

                    <div className="modal-header bg-warning">

                        <h5 className="modal-title fs-6 fw-bold">
                            <i className="bi bi-tools me-2"></i>
                            Signaler un problème
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                        ></button>

                    </div>

                    {succes ? (

                        <>
                            <div className="modal-body">

                                <div className="alert alert-success mb-0">
                                    <i className="bi bi-check-circle me-2"></i>
                                    Votre signalement a bien été envoyé.
                                    Un technicien va le traiter prochainement.
                                </div>

                            </div>

                            <div className="modal-footer bg-light">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={onClose}
                                >
                                    Fermer
                                </button>
                            </div>
                        </>

                    ) : (

                        <form onSubmit={handleSubmit}>

                            <div className="modal-body">

                                <p className="mb-3">
                                    Actif concerné :{" "}
                                    <strong>{actif?.nom}</strong>
                                    {actif?.numeroSerie && (
                                        <span className="text-muted">
                                            {" "}(N° série : {actif.numeroSerie})
                                        </span>
                                    )}
                                </p>

                                {erreur && (
                                    <div className="alert alert-danger py-2">
                                        {erreur}
                                    </div>
                                )}

                                <label className="form-label">
                                    Description du problème
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Décrivez le problème rencontré avec cet actif..."
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                ></textarea>

                            </div>

                            <div className="modal-footer bg-light">

                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={onClose}
                                    disabled={envoi}
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="btn btn-warning btn-sm"
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

        </div>
    );
}

export default SignalerProbleme;
