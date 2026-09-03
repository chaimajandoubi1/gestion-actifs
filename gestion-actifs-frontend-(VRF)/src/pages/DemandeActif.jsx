import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../services/categorieService";
import {
    demanderActif,
    getMesDemandesActif
} from "../services/demandeActifService";

// Cette page permet à un utilisateur de demander un nouvel actif
// (par exemple un ordinateur ou un téléphone supplémentaire).
// La demande est ensuite traitée par l'administrateur ou le technicien
// depuis la page "Demandes".
function DemandeActif() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [mesDemandes, setMesDemandes] = useState([]);

    const [categorieId, setCategorieId] = useState("");
    const [description, setDescription] = useState("");

    const [envoi, setEnvoi] = useState(false);
    const [erreur, setErreur] = useState("");
    const [succes, setSucces] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const charger = async () => {

            try {

                setLoading(true);

                const [categoriesData, demandesResponse] =
                    await Promise.all([
                        getCategories(),
                        getMesDemandesActif()
                    ]);

                setCategories(categoriesData);
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

        if (!description.trim()) {
            setErreur("Merci de décrire l'actif dont vous avez besoin.");
            return;
        }

        try {

            setEnvoi(true);
            setErreur("");

            const reponse = await demanderActif({
                categorieId: categorieId || null,
                description: description.trim()
            });

            setSucces(true);
            setDescription("");
            setCategorieId("");

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
                    Demander un actif
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
                                    Catégorie souhaitée (facultatif)
                                </label>

                                <select
                                    className="form-select"
                                    value={categorieId}
                                    onChange={(e) =>
                                        setCategorieId(e.target.value)
                                    }
                                >
                                    <option value="">
                                        Non spécifiée
                                    </option>

                                    {categories.map((categorie) => (
                                        <option
                                            key={categorie.id}
                                            value={categorie.id}
                                        >
                                            {categorie.nom}
                                        </option>
                                    ))}

                                </select>

                            </div>

                            <div className="col-md-8">

                                <label className="form-label">
                                    Description de votre besoin
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Ex : Un second écran pour le télétravail..."
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
                    <h5 className="mb-0">Mes demandes d'actif</h5>
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
                                        <th>Catégorie</th>
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
                                                {demande.categorie?.nom || "-"}
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

export default DemandeActif;
