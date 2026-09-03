import { useEffect, useState } from "react";
import api from "../services/api";

function AjouterMaintenance({
    maintenanceAModifier,
    onMaintenanceAjoutee,
    onMaintenanceModifiee,
    onAnnuler,
}) {

    const formVide = {
        actif: null,
        type: "",
        date: "",
        description: "",
        cout: "",
    };

    const [actifs, setActifs] = useState([]);
    const [formData, setFormData] = useState(formVide);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const isEditMode = Boolean(maintenanceAModifier);

    useEffect(() => {

        chargerActifs();

    }, []);

    const chargerActifs = async () => {

        try {

            const response = await api.get("/actifs");

            setActifs(response.data);

        } catch (error) {

            console.error(
                "Erreur actifs :",
                error
            );

        }

    };

    useEffect(() => {

        if (maintenanceAModifier) {

            setFormData({
                actif:
                    maintenanceAModifier.actif ||
                    null,

                type:
                    maintenanceAModifier.type ||
                    "",

                date:
                    maintenanceAModifier.date ||
                    "",

                description:
                    maintenanceAModifier.description ||
                    "",

                cout:
                    maintenanceAModifier.cout ??
                    "",
            });

        } else {

            setFormData(formVide);

        }

        setErrorMessage("");

    }, [maintenanceAModifier]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };

    const handleActifChange = (e) => {

        const id = Number(e.target.value);

        const actif =
            actifs.find(
                (a) => a.id === id
            ) || null;

        setFormData((prev) => ({
            ...prev,
            actif,
        }));

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setIsSubmitting(true);
        setErrorMessage("");

        try {

            const donnees = {
                ...formData,
                cout:
                    formData.cout === ""
                        ? null
                        : Number(formData.cout),
            };

            let response;

            if (isEditMode) {

                response = await api.put(
                    `/maintenances/${maintenanceAModifier.id}`,
                    donnees
                );

                onMaintenanceModifiee(
                    response.data
                );

            } else {

                response = await api.post(
                    "/maintenances",
                    donnees
                );

                onMaintenanceAjoutee(
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

                    <i className="bi bi-tools me-2"></i>

                    {isEditMode
                        ? "Modifier la maintenance"
                        : "Ajouter une maintenance"}

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
                                Actif *
                            </label>

                            <select
                                className="form-select"
                                value={
                                    formData.actif?.id ||
                                    ""
                                }
                                onChange={
                                    handleActifChange
                                }
                                required
                            >

                                <option value="">
                                    -- Sélectionner un actif --
                                </option>

                                {actifs.map((actif) => (

                                    <option
                                        key={actif.id}
                                        value={actif.id}
                                    >
                                        {actif.nom}
                                    </option>

                                ))}

                            </select>

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Type *
                            </label>

                            <select
                                className="form-select"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    -- Type --
                                </option>

                                <option value="Préventive">
                                    Préventive
                                </option>

                                <option value="Corrective">
                                    Corrective
                                </option>

                                <option value="Réparation">
                                    Réparation
                                </option>

                            </select>

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Date *
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="col-md-6">

                            <label className="form-label fw-semibold">
                                Coût
                            </label>

                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                className="form-control"
                                name="cout"
                                value={formData.cout}
                                onChange={handleChange}
                                placeholder="Ex : 150 DT"
                            />

                        </div>

                        <div className="col-12">

                            <label className="form-label fw-semibold">
                                Description
                            </label>

                            <textarea
                                className="form-control"
                                rows="3"
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={handleChange}
                                placeholder="Description de l'intervention..."
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
                                    : "Ajouter la maintenance"}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AjouterMaintenance;