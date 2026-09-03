import { useEffect, useState } from "react";

import {
    getDemandesMaintenance,
    traiterDemandeMaintenance
} from "../services/demandeMaintenanceService";

import {
    getDemandesActif,
    traiterDemandeActif
} from "../services/demandeActifService";

import {
    getDemandesLicence,
    traiterDemandeLicence
} from "../services/demandeLicenceService";

// Cette page permet à l'administrateur et au technicien de consulter et
// de traiter les trois types de demandes créées par les utilisateurs :
// signalements de maintenance, demandes d'actif et demandes de licence.
function Demandes() {

    const [onglet, setOnglet] = useState("maintenance");

    const [maintenances, setMaintenances] = useState([]);
    const [actifs, setActifs] = useState([]);
    const [licences, setLicences] = useState([]);

    const [loading, setLoading] = useState(true);
    const [erreur, setErreur] = useState("");

    // Demande en cours de traitement (fenêtre modale).
    const [demandeATraiter, setDemandeATraiter] = useState(null);
    const [statutChoisi, setStatutChoisi] = useState("EN_COURS");
    const [commentaire, setCommentaire] = useState("");
    const [envoi, setEnvoi] = useState(false);

    const chargerTout = async () => {

        try {

            setLoading(true);
            setErreur("");

            const [maintResp, actifResp, licResp] = await Promise.all([
                getDemandesMaintenance(),
                getDemandesActif(),
                getDemandesLicence()
            ]);

            setMaintenances(maintResp.data);
            setActifs(actifResp.data);
            setLicences(licResp.data);

        } catch (error) {

            console.error(error);
            setErreur("Impossible de charger les demandes.");

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        chargerTout();
    }, []);

    const ouvrirTraitement = (demande) => {
        setDemandeATraiter(demande);
        setStatutChoisi(
            demande.statut === "EN_ATTENTE" ? "EN_COURS" : demande.statut
        );
        setCommentaire(demande.commentaireTraitement || "");
    };

    const fermerTraitement = () => {
        setDemandeATraiter(null);
        setCommentaire("");
    };

    const confirmerTraitement = async () => {

        if (!demandeATraiter) {
            return;
        }

        try {

            setEnvoi(true);

            const payload = {
                statut: statutChoisi,
                commentaire: commentaire.trim() || null
            };

            let reponse;

            if (onglet === "maintenance") {
                reponse = await traiterDemandeMaintenance(
                    demandeATraiter.id,
                    payload
                );

                setMaintenances((prev) =>
                    prev.map((d) =>
                        d.id === reponse.data.id ? reponse.data : d
                    )
                );

            } else if (onglet === "actif") {
                reponse = await traiterDemandeActif(
                    demandeATraiter.id,
                    payload
                );

                setActifs((prev) =>
                    prev.map((d) =>
                        d.id === reponse.data.id ? reponse.data : d
                    )
                );

            } else {
                reponse = await traiterDemandeLicence(
                    demandeATraiter.id,
                    payload
                );

                setLicences((prev) =>
                    prev.map((d) =>
                        d.id === reponse.data.id ? reponse.data : d
                    )
                );
            }

            fermerTraitement();

        } catch (error) {

            console.error(error);
            setErreur("Impossible de traiter cette demande.");

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

    const formaterDate = (date) =>
        date ? new Date(date).toLocaleDateString() : "-";

    const listeCourante =
        onglet === "maintenance"
            ? maintenances
            : onglet === "actif"
                ? actifs
                : licences;

    return (

        <div className="container-fluid p-4">

            <h2 className="mb-4">
                Demandes des utilisateurs
            </h2>

            {erreur && (
                <div className="alert alert-danger">
                    {erreur}
                </div>
            )}

            <ul className="nav nav-tabs mb-4">

                <li className="nav-item">
                    <button
                        className={`nav-link ${onglet === "maintenance" ? "active" : ""}`}
                        onClick={() => setOnglet("maintenance")}
                    >
                        <i className="bi bi-tools me-1"></i>
                        Maintenance
                        <span className="badge bg-secondary ms-2">
                            {maintenances.length}
                        </span>
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className={`nav-link ${onglet === "actif" ? "active" : ""}`}
                        onClick={() => setOnglet("actif")}
                    >
                        <i className="bi bi-pc-display me-1"></i>
                        Actifs
                        <span className="badge bg-secondary ms-2">
                            {actifs.length}
                        </span>
                    </button>
                </li>

                <li className="nav-item">
                    <button
                        className={`nav-link ${onglet === "licence" ? "active" : ""}`}
                        onClick={() => setOnglet("licence")}
                    >
                        <i className="bi bi-key me-1"></i>
                        Licences
                        <span className="badge bg-secondary ms-2">
                            {licences.length}
                        </span>
                    </button>
                </li>

            </ul>

            <div className="card shadow-sm">

                <div className="card-body">

                    {loading ? (

                        <p>Chargement...</p>

                    ) : listeCourante.length === 0 ? (

                        <div className="alert alert-info mb-0">
                            Aucune demande dans cette catégorie.
                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle">

                                <thead>

                                    <tr>

                                        <th>Utilisateur</th>

                                        {onglet === "maintenance" && (
                                            <>
                                                <th>Actif</th>
                                                <th>Problème signalé</th>
                                            </>
                                        )}

                                        {onglet === "actif" && (
                                            <>
                                                <th>Catégorie souhaitée</th>
                                                <th>Description</th>
                                            </>
                                        )}

                                        {onglet === "licence" && (
                                            <>
                                                <th>Licence</th>
                                                <th>Justification</th>
                                            </>
                                        )}

                                        <th>Date</th>
                                        <th>Statut</th>
                                        <th>Commentaire</th>
                                        <th>Actions</th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {listeCourante.map((demande) => (

                                        <tr key={demande.id}>

                                            <td>
                                                {demande.utilisateur?.nom}
                                                <div className="text-muted small">
                                                    {demande.utilisateur?.email}
                                                </div>
                                            </td>

                                            {onglet === "maintenance" && (
                                                <>
                                                    <td>
                                                        {demande.actif?.nom}
                                                        <div className="text-muted small">
                                                            {demande.actif?.numeroSerie}
                                                        </div>
                                                    </td>
                                                    <td>{demande.description}</td>
                                                </>
                                            )}

                                            {onglet === "actif" && (
                                                <>
                                                    <td>
                                                        {demande.categorie?.nom || "-"}
                                                    </td>
                                                    <td>{demande.description}</td>
                                                </>
                                            )}

                                            {onglet === "licence" && (
                                                <>
                                                    <td>{demande.licence?.nom}</td>
                                                    <td>{demande.description || "-"}</td>
                                                </>
                                            )}

                                            <td>
                                                {formaterDate(demande.dateCreation)}
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

                                            <td>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => ouvrirTraitement(demande)}
                                                >
                                                    <i className="bi bi-check2-square me-1"></i>
                                                    Traiter
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
                FENÊTRE DE TRAITEMENT
            ================================================= */}

            {demandeATraiter && (

                <div
                    className="modal fade show d-block bg-dark bg-opacity-50"
                    tabIndex="-1"
                    role="dialog"
                >
                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content shadow border-0">

                            <div className="modal-header bg-primary text-white">

                                <h5 className="modal-title fs-6 fw-bold">
                                    <i className="bi bi-check2-square me-2"></i>
                                    Traiter la demande
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={fermerTraitement}
                                ></button>

                            </div>

                            <div className="modal-body">

                                <div className="mb-3">

                                    <label className="form-label">
                                        Statut
                                    </label>

                                    <select
                                        className="form-select"
                                        value={statutChoisi}
                                        onChange={(e) =>
                                            setStatutChoisi(e.target.value)
                                        }
                                    >
                                        <option value="EN_ATTENTE">En attente</option>
                                        <option value="EN_COURS">En cours</option>
                                        <option value="TRAITEE">Traitée</option>
                                        <option value="REJETEE">Rejetée</option>
                                    </select>

                                </div>

                                <div>

                                    <label className="form-label">
                                        Commentaire (facultatif)
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        value={commentaire}
                                        onChange={(e) =>
                                            setCommentaire(e.target.value)
                                        }
                                    ></textarea>

                                </div>

                            </div>

                            <div className="modal-footer bg-light">

                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm"
                                    onClick={fermerTraitement}
                                    disabled={envoi}
                                >
                                    Annuler
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary btn-sm"
                                    onClick={confirmerTraitement}
                                    disabled={envoi}
                                >
                                    {envoi ? "Enregistrement..." : "Enregistrer"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Demandes;
