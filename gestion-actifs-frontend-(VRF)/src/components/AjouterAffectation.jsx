
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getActifs } from "../services/actifService";

import {
    ajouterAffectation,
    modifierAffectation,
    getAffectationById
} from "../services/affectationService";

import api from "../services/api";

function AjouterAffectation() {

    const navigate = useNavigate();

    const { id } = useParams();

    // Cette partie permet de savoir si le formulaire est utilisé pour une modification.
    const modeModification = Boolean(id);

    const [formData, setFormData] = useState({
        actifId: "",
        utilisateurId: "",
        dateDebut: "",
        dateFin: ""
    });

    const [actifs, setActifs] = useState([]);

    const [utilisateurs, setUtilisateurs] = useState([]);

    const [loading, setLoading] = useState(false);

    const [chargementDonnees, setChargementDonnees] =
        useState(true);

    const [erreur, setErreur] = useState("");

    // Cette fonction charge les actifs et les utilisateurs nécessaires au formulaire.
    const chargerDonnees = async () => {

        try {

            setChargementDonnees(true);
            setErreur("");

            const [
                actifsData,
                utilisateursResponse
            ] = await Promise.all([
                getActifs(),
                api.get("/utilisateurs")
            ]);

            // Cette partie vérifie que les actifs reçus sont bien sous forme de tableau.
            setActifs(
                Array.isArray(actifsData)
                    ? actifsData
                    : []
            );

            // Cette partie vérifie que les utilisateurs reçus sont bien sous forme de tableau.
            setUtilisateurs(
                Array.isArray(
                    utilisateursResponse.data
                )
                    ? utilisateursResponse.data
                    : []
            );

            // Cette partie récupère les informations de l'affectation lorsqu'il s'agit d'une modification.
            if (modeModification) {

                const affectation =
                    await getAffectationById(id);

                // Cette ligne permet de vérifier les données reçues dans la console.
                console.log(
                    "Affectation récupérée :",
                    affectation
                );

                // Le backend renvoie directement actifId et utilisateurId.
                setFormData({

                    actifId:
                        affectation.actifId !== undefined &&
                        affectation.actifId !== null
                            ? String(
                                affectation.actifId
                            )
                            : "",

                    utilisateurId:
                        affectation.utilisateurId !== undefined &&
                        affectation.utilisateurId !== null
                            ? String(
                                affectation.utilisateurId
                            )
                            : "",

                    dateDebut:
                        affectation.dateDebut || "",

                    dateFin:
                        affectation.dateFin || ""
                });
            }

        } catch (error) {

            console.error(
                "Erreur chargement :",
                error
            );

            setErreur(
                modeModification
                    ? "Impossible de charger l'affectation."
                    : "Impossible de charger les données."
            );

        } finally {

            setChargementDonnees(false);
        }
    };

    // Cette partie charge les données lorsque la page est ouverte ou lorsque l'identifiant change.
    useEffect(() => {

        chargerDonnees();

    }, [id]);

    // Cette fonction met à jour la valeur du champ actuellement modifié.
    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((ancien) => ({

            ...ancien,

            [name]: value

        }));
    };

    // Cette fonction vérifie les données puis ajoute ou modifie l'affectation.
    const handleSubmit = async (e) => {

        e.preventDefault();

        setErreur("");

        // Cette partie vérifie que les champs obligatoires sont remplis.
        if (
            !formData.actifId ||
            !formData.utilisateurId ||
            !formData.dateDebut
        ) {

            setErreur(
                "Veuillez sélectionner un actif, un utilisateur et une date de début."
            );

            return;
        }

        try {

            setLoading(true);

            // Cette partie prépare les données envoyées au backend.
            const affectation = {

                actif: {

                    id: Number(
                        formData.actifId
                    )

                },

                utilisateur: {

                    id: Number(
                        formData.utilisateurId
                    )

                },

                dateDebut:
                    formData.dateDebut,

                dateFin:
                    formData.dateFin || null
            };

            // Cette partie utilise la requête PUT lorsqu'une affectation doit être modifiée.
            if (modeModification) {

                await modifierAffectation(
                    id,
                    affectation
                );

                alert(
                    "Affectation modifiée avec succès."
                );

            } else {

                // Cette partie utilise la requête POST lorsqu'une nouvelle affectation doit être créée.
                await ajouterAffectation(
                    affectation
                );

                alert(
                    "Affectation ajoutée avec succès."
                );
            }

            // Cette partie retourne vers la liste des affectations après l'opération.
            navigate("/affectations");

        } catch (error) {

            console.error(
                "Erreur affectation :",
                error
            );

            setErreur(
                error.response?.data?.message ||
                (
                    modeModification
                        ? "Impossible de modifier l'affectation."
                        : "Impossible d'ajouter l'affectation."
                )
            );

        } finally {

            setLoading(false);
        }
    };

    // Cette partie affiche un chargement pendant la récupération des données.
    if (chargementDonnees) {

        return (

            <div className="container py-5">

                <div className="text-center">

                    <div
                        className="spinner-border text-primary"
                    ></div>

                    <p className="mt-3 text-muted">

                        Chargement des données...

                    </p>

                </div>

            </div>
        );
    }

    return (

        <div className="container py-4">

            <div className="row justify-content-center">

                <div className="col-lg-8">

                    <div className="card shadow-sm border-0">

                        <div className="card-body p-4">

                            <div className="mb-4">

                                <h2 className="fw-bold">

                                    <i className="bi bi-person-check me-2"></i>

                                    {modeModification
                                        ? "Modifier une affectation"
                                        : "Nouvelle affectation"}

                                </h2>

                                <p className="text-muted mb-0">

                                    {modeModification
                                        ? "Modifier les informations de l'affectation."
                                        : "Affecter un actif existant à un utilisateur."}

                                </p>

                            </div>

                            {erreur && (

                                <div className="alert alert-danger">

                                    <i className="bi bi-exclamation-triangle me-2"></i>

                                    {erreur}

                                </div>

                            )}

                            <form
                                onSubmit={handleSubmit}
                            >

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">

                                        Actif *

                                    </label>

                                    <select
                                        name="actifId"
                                        value={formData.actifId}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >

                                        <option value="">

                                            Sélectionner un actif

                                        </option>

                                        {actifs.map(
                                            (actif) => (

                                                <option
                                                    key={
                                                        actif.id
                                                    }
                                                    value={
                                                        actif.id
                                                    }
                                                >

                                                    {actif.nom}
                                                    {" — "}
                                                    {actif.marque}
                                                    {" "}
                                                    {actif.modele}
                                                    {" — N° "}
                                                    {actif.numeroSerie}

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">

                                        Utilisateur *

                                    </label>

                                    <select
                                        name="utilisateurId"
                                        value={
                                            formData.utilisateurId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        className="form-select"
                                        required
                                    >

                                        <option value="">

                                            Sélectionner un utilisateur

                                        </option>

                                        {utilisateurs.map(
                                            (utilisateur) => (

                                                <option
                                                    key={
                                                        utilisateur.id
                                                    }
                                                    value={
                                                        utilisateur.id
                                                    }
                                                >

                                                    {utilisateur.nom}
                                                    {" — "}
                                                    {utilisateur.email}

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>

                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label fw-semibold">

                                            Date de début *

                                        </label>

                                        <input
                                            type="date"
                                            name="dateDebut"
                                            value={
                                                formData.dateDebut
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="form-control"
                                            required
                                        />

                                    </div>

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label fw-semibold">

                                            Date de fin

                                        </label>

                                        <input
                                            type="date"
                                            name="dateFin"
                                            value={
                                                formData.dateFin
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            className="form-control"
                                        />

                                    </div>

                                </div>

                                <div className="d-flex justify-content-end gap-2 mt-4">

                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() =>
                                            navigate(
                                                "/affectations"
                                            )
                                        }
                                        disabled={
                                            loading
                                        }
                                    >

                                        <i className="bi bi-x-circle me-2"></i>

                                        Annuler

                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={
                                            loading
                                        }
                                    >

                                        {loading ? (

                                            <>

                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                ></span>

                                                Enregistrement...

                                            </>

                                        ) : (

                                            <>

                                                <i className="bi bi-check-circle me-2"></i>

                                                {modeModification
                                                    ? "Enregistrer les modifications"
                                                    : "Créer l'affectation"}

                                            </>

                                        )}

                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default AjouterAffectation;
