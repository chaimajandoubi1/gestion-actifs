import { useEffect, useState } from "react";
import api from "../services/api";

function AjouterLicence({
    licenceAModifier,
    onLicenceAjoutee,
    onLicenceModifiee,
    onAnnuler,
}) {

    const formVide = {
        nom: "",
        editeur: "",
        dateExpiration: "",
        nbPostes: "",
    };

    const [formData, setFormData] = useState(formVide);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const isEditMode = Boolean(licenceAModifier);

    useEffect(() => {

        if (licenceAModifier) {

            setFormData({
                nom: licenceAModifier.nom || "",
                editeur: licenceAModifier.editeur || "",
                dateExpiration:
                    licenceAModifier.dateExpiration ||
                    "",
                nbPostes:
                    licenceAModifier.nbPostes ??
                    "",
            });

        } else {

            setFormData(formVide);

        }

        setErrorMessage("");

    }, [licenceAModifier]);

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

            const donnees = {
                ...formData,
                nbPostes:
                    formData.nbPostes === ""
                        ? null
                        : Number(formData.nbPostes),
            };

            let response;

            if (isEditMode) {

                response = await api.put(
                    `/licences/${licenceAModifier.id}`,
                    donnees
                );

                onLicenceModifiee(
                    response.data
                );

            } else {

                response = await api.post(
                    "/licences",
                    donnees
                );

                onLicenceAjoutee(
                    response.data
                );

                setFormData(formVide);
            }

        } catch (error) {

            console.error(error);

            setErrorMessage(
                error.response?.data?.message ||
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

                    <i className="bi bi-key-fill me-2"></i>

                    {isEditMode
                        ? "Modifier la licence"
                        : "Ajouter une nouvelle licence"}

                </h5>

            </div>

            <div className="card-body">

                {errorMessage && (

                    <div className="alert alert-danger">
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
                                placeholder="Ex : Microsoft 365"
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Éditeur
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="editeur"
                                value={formData.editeur}
                                onChange={handleChange}
                                placeholder="Ex : Microsoft"
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Date d'expiration
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                name="dateExpiration"
                                value={
                                    formData.dateExpiration
                                }
                                onChange={handleChange}
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Nombre de postes
                            </label>

                            <input
                                type="number"
                                min="0"
                                className="form-control"
                                name="nbPostes"
                                value={formData.nbPostes}
                                onChange={handleChange}
                                placeholder="Ex : 10"
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
                                    : "Ajouter la licence"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AjouterLicence;