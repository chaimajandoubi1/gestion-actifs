import { useEffect, useState } from "react";

import {
    getCategories,
    supprimerCategorie,
} from "../services/categorieService";

import AjouterCategorie from "../components/AjouterCategorie";

function Categories() {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [categorieSelectionnee, setCategorieSelectionnee] =
        useState(null);

    const [categorieASupprimer, setCategorieASupprimer] =
        useState(null);

    useEffect(() => {
        chargerCategories();
    }, []);

    const chargerCategories = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getCategories();

            setCategories(data);

        } catch (error) {

            console.error(error);

            setError(
                error.response?.data?.message ||
                "Impossible de récupérer les catégories."
            );

        } finally {

            setLoading(false);

        }
    };

    // ===============================
    // AJOUT
    // ===============================

    const handleCategorieAjoutee = (nouvelleCategorie) => {

        setCategories((prev) => [
            ...prev,
            nouvelleCategorie,
        ]);

    };

    // ===============================
    // MODIFICATION
    // ===============================

    const handleCategorieModifiee = (categorieModifiee) => {

        setCategories((prev) =>
            prev.map((categorie) =>
                categorie.id === categorieModifiee.id
                    ? categorieModifiee
                    : categorie
            )
        );

        setCategorieSelectionnee(null);
    };

    // ===============================
    // MODIFIER
    // ===============================

    const handleModifier = (categorie) => {

        setCategorieSelectionnee(categorie);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ===============================
    // SUPPRIMER
    // ===============================

    const handleSupprimer = async () => {

        if (!categorieASupprimer) {
            return;
        }

        try {

            await supprimerCategorie(
                categorieASupprimer.id
            );

            setCategories((prev) =>
                prev.filter(
                    (categorie) =>
                        categorie.id !==
                        categorieASupprimer.id
                )
            );

            setCategorieASupprimer(null);

        } catch (error) {

            console.error(
                "Erreur suppression :",
                error
            );

            alert(
                error.response?.data?.message ||
                "Impossible de supprimer cette catégorie."
            );

        }

    };

    // ===============================
    // RECHERCHE
    // ===============================

    const categoriesFiltrees = categories.filter(
        (categorie) =>
            categorie.nom
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            categorie.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    // ===============================
    // LOADING
    // ===============================

    if (loading) {

        return (
            <div className="d-flex justify-content-center align-items-center py-5">

                <div
                    className="spinner-border text-primary me-3"
                    role="status"
                ></div>

                <span className="text-muted">
                    Chargement des catégories...
                </span>

            </div>
        );

    }

    return (

        <div className="container py-4">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h1 className="h3 fw-bold mb-1">

                        <i className="bi bi-tags-fill text-primary me-2"></i>

                        Gestion des catégories

                    </h1>

                    <p className="text-muted mb-0">

                        Gérez les catégories des actifs informatiques.

                    </p>

                </div>

                <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-2">

                    Total : {categories.length}

                </span>

            </div>

            {/* ERREUR */}

            {error && (

                <div className="alert alert-danger">

                    <i className="bi bi-exclamation-triangle-fill me-2"></i>

                    {error}

                </div>

            )}

            {/* FORMULAIRE AJOUT */}

            <AjouterCategorie

                categorieAModifier={
                    categorieSelectionnee
                }

                onCategorieAjoutee={
                    handleCategorieAjoutee
                }

                onCategorieModifiee={
                    handleCategorieModifiee
                }

                onAnnuler={() =>
                    setCategorieSelectionnee(null)
                }

            />

            {/* TABLEAU */}

            <div className="card border-0 shadow-sm">

                <div className="card-header bg-white py-3">

                    <div className="d-flex justify-content-between align-items-center">

                        <h5 className="mb-0 fw-bold">

                            <i className="bi bi-list-ul text-primary me-2"></i>

                            Catégories enregistrées

                        </h5>

                        <div
                            className="input-group"
                            style={{
                                maxWidth: "300px",
                            }}
                        >

                            <span className="input-group-text bg-light">

                                <i className="bi bi-search"></i>

                            </span>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                    </div>

                </div>

                <div className="card-body p-0">

                    {categoriesFiltrees.length === 0 ? (

                        <div className="text-center py-5 text-muted">

                            <i className="bi bi-inbox fs-1 d-block mb-3"></i>

                            Aucune catégorie trouvée.

                        </div>

                    ) : (

                        <div className="table-responsive">

                            <table className="table table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>ID</th>

                                        <th>Nom</th>

                                        <th>Description</th>

                                        <th className="text-end">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {categoriesFiltrees.map(
                                        (categorie) => (

                                            <tr
                                                key={
                                                    categorie.id
                                                }
                                            >

                                                <td>

                                                    <span className="badge bg-light text-dark border">

                                                        #{categorie.id}

                                                    </span>

                                                </td>

                                                <td className="fw-semibold">

                                                    <i className="bi bi-tag-fill text-primary me-2"></i>

                                                    {categorie.nom}

                                                </td>

                                                <td className="text-muted">

                                                    {categorie.description ||
                                                        "Aucune description"}

                                                </td>

                                                <td className="text-end">

                                                    <div className="btn-group btn-group-sm">

                                                        <button
                                                            className="btn btn-outline-warning"
                                                            onClick={() =>
                                                                handleModifier(
                                                                    categorie
                                                                )
                                                            }
                                                        >

                                                            <i className="bi bi-pencil me-1"></i>

                                                            Modifier

                                                        </button>

                                                        <button
                                                            className="btn btn-outline-danger"
                                                            onClick={() =>
                                                                setCategorieASupprimer(
                                                                    categorie
                                                                )
                                                            }
                                                        >

                                                            <i className="bi bi-trash me-1"></i>

                                                            Supprimer

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

            {/* MODAL SUPPRESSION */}

            {categorieASupprimer && (

                <div
                    className="modal fade show d-block"
                    style={{
                        backgroundColor:
                            "rgba(0,0,0,0.5)",
                    }}
                >

                    <div className="modal-dialog modal-dialog-centered">

                        <div className="modal-content border-0 shadow">

                            <div className="modal-header bg-danger text-white">

                                <h5 className="modal-title">

                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>

                                    Confirmation

                                </h5>

                                <button
                                    className="btn-close btn-close-white"
                                    onClick={() =>
                                        setCategorieASupprimer(
                                            null
                                        )
                                    }
                                ></button>

                            </div>

                            <div className="modal-body">

                                Êtes-vous sûr de vouloir supprimer la catégorie{" "}

                                <strong>
                                    {
                                        categorieASupprimer.nom
                                    }
                                </strong>

                                ?

                            </div>

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setCategorieASupprimer(
                                            null
                                        )
                                    }
                                >
                                    Annuler
                                </button>

                                <button
                                    className="btn btn-danger"
                                    onClick={
                                        handleSupprimer
                                    }
                                >
                                    <i className="bi bi-trash me-1"></i>
                                    Supprimer
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Categories;