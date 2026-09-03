import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getActifById } from "../services/actifService";


function ActifDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [actif, setActif] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        getActifById(id)
            .then((response) => {
                setActif(response.data);
            })
            .catch((error) => {
                console.error("Erreur API :", error);
                setError("Impossible de récupérer cet actif.");
            })
            .finally(() => {
                setLoading(false);
            });

    }, [id]);

    if (loading) {
        return <h2>Chargement...</h2>;
    }

    if (error) {
        return (
            <div>
                <h2>{error}</h2>
                <Link to="/actifs">Retour à la liste</Link>
            </div>
        );
    }

    return (
        <div>
            <h1>Détails de l'actif</h1>

            <div style={{ border: "1px solid #ccc", padding: "20px", maxWidth: "500px" }}>
                <p><strong>Nom :</strong> {actif.nom}</p>
                <p><strong>Type :</strong> {actif.type}</p>
                <p><strong>Marque :</strong> {actif.marque}</p>
                <p><strong>Modèle :</strong> {actif.modele}</p>
                <p><strong>Numéro de série :</strong> {actif.numeroSerie}</p>
                <p><strong>Date d'achat :</strong> {actif.dateAchat}</p>
                <p><strong>Statut :</strong> {actif.statut}</p>
                <p><strong>Date fin garantie :</strong> {actif.dateFinGarantie}</p>
                <p><strong>Catégorie :</strong> {actif.categorie?.nom || "Aucune"}</p>
            </div>

            <br />

            <button onClick={() => navigate("/actifs")}>
                Retour à la liste
            </button>
        </div>
    );
}

export default ActifDetails;