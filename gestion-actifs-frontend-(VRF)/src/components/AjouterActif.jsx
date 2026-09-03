
import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import api from "../services/api";

function AjouterActif() {

    const navigate = useNavigate();

    const { id } = useParams();

    const modeModification = Boolean(id);

    const [formData, setFormData] = useState({
        nom: "",
        type: "",
        marque: "",
        modele: "",
        numeroSerie: "",
        dateAchat: "",
        statut: "",
        dateFinGarantie: "",
        categorieId: ""
    });

    const [categories, setCategories] = useState([]);

    const [erreur, setErreur] = useState("");

    const [success, setSuccess] = useState("");

    const [loading, setLoading] = useState(false);


    useEffect(() => {

        const chargerCategories = async () => {

            try {

                const response =
                    await api.get("/categories");

                setCategories(response.data);

            } catch (error) {

                console.error(
                    "Erreur catégories :",
                    error
                );

                setErreur(
                    "Impossible de charger les catégories."
                );
            }
        };


        chargerCategories();

    }, []);


    useEffect(() => {

        if (!id) {
            return;
        }


        const chargerActif = async () => {

            try {

                setLoading(true);

                const response =
                    await api.get(`/actifs/${id}`);

                const actif = response.data;

                setFormData({

                    nom: actif.nom || "",

                    type: actif.type || "",

                    marque: actif.marque || "",

                    modele: actif.modele || "",

                    numeroSerie:
                        actif.numeroSerie || "",

                    dateAchat:
                        actif.dateAchat || "",

                    statut:
                        actif.statut || "",

                    dateFinGarantie:
                        actif.dateFinGarantie || "",

                    categorieId:
                        actif.categorie?.id
                            ? String(actif.categorie.id)
                            : ""

                });

            } catch (error) {

                console.error(
                    "Erreur chargement actif :",
                    error
                );

                setErreur(
                    "Impossible de charger l'actif."
                );

            } finally {

                setLoading(false);
            }
        };


        chargerActif();

    }, [id]);


    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        setErreur("");

        setSuccess("");

        try {

            const actif = {

                nom: formData.nom,

                type: formData.type,

                marque: formData.marque,

                modele: formData.modele,

                numeroSerie:
                    formData.numeroSerie,

                dateAchat:
                    formData.dateAchat,

                statut:
                    formData.statut,

                dateFinGarantie:
                    formData.dateFinGarantie || null,

                categorie: {

                    id:
                        Number(
                            formData.categorieId
                        )

                }

            };


            let response;


            if (modeModification) {

                response =
                    await api.put(
                        `/actifs/${id}`,
                        actif
                    );

                console.log(
                    "Actif modifié :",
                    response.data
                );

                setSuccess(
                    "Actif modifié avec succès."
                );

            } else {

                response =
                    await api.post(
                        "/actifs",
                        actif
                    );

                console.log(
                    "Actif ajouté :",
                    response.data
                );

                setSuccess(
                    "Actif ajouté avec succès."
                );
            }


            setTimeout(() => {

                navigate(
                    "/actifs"
                );

            }, 800);


        } catch (error) {

            console.error(
                "Erreur actif :",
                error
            );

            setErreur(

                error.response?.data?.message ||

                (
                    modeModification
                        ? "Erreur lors de la modification de l'actif."
                        : "Erreur lors de l'ajout de l'actif."
                )
            );
        }
    };


    if (loading) {

        return (

            <div className="container-fluid p-4">

                <div className="text-center p-5">

                    <div
                        className="spinner-border text-primary"
                    />

                    <p className="mt-2">
                        Chargement de l'actif...
                    </p>

                </div>

            </div>
        );
    }


    return (

        <div className="container-fluid p-4">

            <div className="card shadow-sm">

                <div className="card-body p-4">


                    <div className="d-flex justify-content-between align-items-center mb-4">

                        <div>

                            <h2>

                                <i className="bi bi-laptop me-2"></i>

                                {modeModification
                                    ? "Modifier un actif"
                                    : "Ajouter un actif"}

                            </h2>

                            <p className="text-muted">

                                {modeModification
                                    ? "Modifier les informations de l'équipement informatique."
                                    : "Ajouter un nouvel équipement informatique."}

                            </p>

                        </div>


                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate("/actifs")
                            }
                        >

                            <i className="bi bi-arrow-left me-2"></i>

                            Retour

                        </button>

                    </div>


                    {erreur && (

                        <div className="alert alert-danger">

                            {erreur}

                        </div>

                    )}


                    {success && (

                        <div className="alert alert-success">

                            {success}

                        </div>

                    )}


                    <form
                        onSubmit={handleSubmit}
                    >

                        <div className="row">


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Nom
                                </label>

                                <input
                                    type="text"
                                    name="nom"
                                    className="form-control"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Type
                                </label>

                                <input
                                    type="text"
                                    name="type"
                                    className="form-control"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Marque
                                </label>

                                <input
                                    type="text"
                                    name="marque"
                                    className="form-control"
                                    value={formData.marque}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Modèle
                                </label>

                                <input
                                    type="text"
                                    name="modele"
                                    className="form-control"
                                    value={formData.modele}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Numéro de série
                                </label>

                                <input
                                    type="text"
                                    name="numeroSerie"
                                    className="form-control"
                                    value={formData.numeroSerie}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Date d'achat
                                </label>

                                <input
                                    type="date"
                                    name="dateAchat"
                                    className="form-control"
                                    value={formData.dateAchat}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Statut
                                </label>

                                <select
                                    name="statut"
                                    className="form-select"
                                    value={formData.statut}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Sélectionner
                                    </option>

                                    <option value="DISPONIBLE">
                                        Disponible
                                    </option>

                                    <option value="AFFECTE">
                                        Affecté
                                    </option>

                                    <option value="MAINTENANCE">
                                        Maintenance
                                    </option>

                                    <option value="HORS_SERVICE">
                                        Hors service
                                    </option>

                                </select>

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Catégorie
                                </label>

                                <select
                                    name="categorieId"
                                    className="form-select"
                                    value={formData.categorieId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Sélectionner une catégorie
                                    </option>

                                    {categories.map(
                                        (categorie) => (

                                            <option
                                                key={categorie.id}
                                                value={categorie.id}
                                            >
                                                {categorie.nom}
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="col-md-6 mb-3">

                                <label className="form-label">
                                    Date fin de garantie
                                </label>

                                <input
                                    type="date"
                                    name="dateFinGarantie"
                                    className="form-control"
                                    value={formData.dateFinGarantie}
                                    onChange={handleChange}
                                />

                            </div>

                        </div>


                        <div className="d-flex gap-2 mt-4">

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >

                                <i
                                    className={
                                        modeModification
                                            ? "bi bi-pencil me-2"
                                            : "bi bi-check-circle me-2"
                                    }
                                ></i>

                                {modeModification
                                    ? "Modifier"
                                    : "Ajouter"}

                            </button>


                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate("/actifs")
                                }
                            >

                                Annuler

                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default AjouterActif;
