import { useEffect, useState } from "react";
import api from "../services/api";

// Rôles reconnus par la sécurité de l'application (Spring Security).
// Toute autre valeur (ex : "Informaticien", "Responsable") n'est PAS
// un rôle, mais un intitulé de poste : voir le champ "poste" plus bas.
const ROLES_DISPONIBLES = ["ADMIN", "TECHNICIEN", "UTILISATEUR"];

// Suggestions d'intitulés de poste (purement informatif, sans impact
// sur les droits d'accès).
const POSTES_SUGGERES = [
    "Informaticien",
    "Responsable",
    "Comptable",
    "Assistant(e)",
];

function AjouterUtilisateur({
    utilisateurAModifier,
    onUtilisateurAjoute,
    onUtilisateurModifie,
    onAnnuler,
}) {

    const formVide = {
        nom: "",
        email: "",
        role: "UTILISATEUR",
        service: "",
        poste: "",
        motDePasse: "",
    };

    const [formData, setFormData] = useState(formVide);

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [errorMessage, setErrorMessage] =
        useState("");

    const isEditMode =
        Boolean(utilisateurAModifier);

    useEffect(() => {

        if (utilisateurAModifier) {

            setFormData({
                nom:
                    utilisateurAModifier.nom || "",

                email:
                    utilisateurAModifier.email || "",

                // Si un ancien compte a un rôle invalide en base
                // (ex : "INFORMATICIEN"), on le ramène à UTILISATEUR
                // par défaut dans le formulaire plutôt que de le
                // renvoyer tel quel.
                role: ROLES_DISPONIBLES.includes(
                    (utilisateurAModifier.role || "").toUpperCase()
                )
                    ? utilisateurAModifier.role.toUpperCase()
                    : "UTILISATEUR",

                service:
                    utilisateurAModifier.service ||
                    "",

                poste:
                    utilisateurAModifier.poste ||
                    "",

                motDePasse: "",
            });

        } else {

            setFormData(formVide);

        }

        setErrorMessage("");

    }, [utilisateurAModifier]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setIsSubmitting(true);
        setErrorMessage("");

        try {

            const utilisateur = { ...formData };

            // Ne pas envoyer un mot de passe vide lors d'une modification
            if (
                isEditMode &&
                !utilisateur.motDePasse
            ) {

                delete utilisateur.motDePasse;

            }

            let response;

            if (isEditMode) {

                response = await api.put(
                    `/utilisateurs/${utilisateurAModifier.id}`,
                    utilisateur
                );

                onUtilisateurModifie(
                    response.data
                );

            } else {

                response = await api.post(
                    "/utilisateurs",
                    utilisateur
                );

                onUtilisateurAjoute(
                    response.data
                );

                setFormData(formVide);
            }

        } catch (error) {

            console.error(
                "Erreur utilisateur :",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                (typeof error.response?.data === "string"
                    ? error.response.data
                    : null) ||
                error.message ||
                "Erreur lors de l'enregistrement."
            );

        } finally {

            setIsSubmitting(false);

        }

    };

    return (

        <div className="card shadow-sm mb-4 border-0">

            <div
                className={`card-header ${
                    isEditMode
                        ? "bg-warning"
                        : "bg-primary text-white"
                }`}
            >

                <h5 className="mb-0 fw-bold">

                    <i className="bi bi-person-plus-fill me-2"></i>

                    {isEditMode
                        ? "Modifier l'utilisateur"
                        : "Ajouter un utilisateur"}

                </h5>

            </div>

            <div className="card-body">

                {errorMessage && (

                    <div className="alert alert-danger">

                        <i className="bi bi-exclamation-triangle me-2"></i>

                        {errorMessage}

                    </div>

                )}

                <form onSubmit={handleSubmit}>

                    <div className="row g-3">

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Nom *
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Email *
                            </label>

                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Mot de passe
                                {!isEditMode && (
                                    <span className="text-danger">
                                        {" "}*
                                    </span>
                                )}
                            </label>

                            <input
                                type="password"
                                className="form-control"
                                name="motDePasse"
                                value={
                                    formData.motDePasse
                                }
                                onChange={handleChange}
                                required={!isEditMode}
                                placeholder={
                                    isEditMode
                                        ? "Laisser vide pour conserver"
                                        : "Mot de passe"
                                }
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Rôle (accès à l'application) *
                            </label>

                            <select
                                className="form-select"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >

                                <option value="ADMIN">
                                    Admin
                                </option>

                                <option value="TECHNICIEN">
                                    Technicien
                                </option>

                                <option value="UTILISATEUR">
                                    Utilisateur
                                </option>

                            </select>

                            <div className="form-text">
                                Détermine les droits dans l'application.
                                Pour un intitulé de poste (Informaticien,
                                Responsable...), utilisez le champ "Poste"
                                ci-dessous.
                            </div>

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Poste / Fonction
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                list="postes-suggeres"
                                name="poste"
                                value={formData.poste}
                                onChange={handleChange}
                                placeholder="Ex : Informaticien, Responsable..."
                            />

                            <datalist id="postes-suggeres">
                                {POSTES_SUGGERES.map((poste) => (
                                    <option key={poste} value={poste} />
                                ))}
                            </datalist>

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Service *
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="service"
                                value={
                                    formData.service
                                }
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>

                    <div className="d-flex justify-content-end gap-2 mt-4">

                        {isEditMode && (

                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={onAnnuler}
                            >
                                Annuler
                            </button>

                        )}

                        <button
                            type="submit"
                            className={`btn ${
                                isEditMode
                                    ? "btn-warning"
                                    : "btn-primary"
                            }`}
                            disabled={isSubmitting}
                        >

                            {isSubmitting
                                ? "Enregistrement..."
                                : isEditMode
                                    ? "Enregistrer"
                                    : "Ajouter l'utilisateur"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AjouterUtilisateur;
