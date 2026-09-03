import { useEffect, useState } from "react";
import {
  ajouterCategorie,
  modifierCategorie,
} from "../services/categorieService";

function AjouterCategorie({
  categorieAModifier,
  onCategorieAjoutee,
  onCategorieModifiee,
  onAnnuler,
}) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditMode = Boolean(categorieAModifier);

  useEffect(() => {
    if (categorieAModifier) {
      setNom(categorieAModifier.nom || "");
      setDescription(categorieAModifier.description || "");
    } else {
      setNom("");
      setDescription("");
    }

    setError("");
  }, [categorieAModifier]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nom.trim()) {
      setError("Le nom de la catégorie est obligatoire.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const categorie = {
        nom: nom.trim(),
        description: description.trim(),
      };

      if (isEditMode) {
        const resultat = await modifierCategorie(
          categorieAModifier.id,
          categorie
        );

        onCategorieModifiee(resultat);
      } else {
        const resultat = await ajouterCategorie(categorie);

        onCategorieAjoutee(resultat);
      }

      setNom("");
      setDescription("");
    } catch (error) {
      console.error("Erreur catégorie :", error);

      if (error.response?.status === 403) {
        setError("Accès refusé : seuls les administrateurs peuvent gérer les catégories.");
      } else {
        setError(
          error.response?.data?.message ||
          "Une erreur est survenue lors de l'enregistrement."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnnuler = () => {
    setNom("");
    setDescription("");
    setError("");

    if (onAnnuler) {
      onAnnuler();
    }
  };

  return (
    <div className="card shadow-sm border-0 mb-4">
      <div
        className={`card-header d-flex justify-content-between align-items-center ${
          isEditMode ? "bg-warning" : "bg-primary"
        }`}
      >
        <h5 className="mb-0 fw-bold text-white">
          <i
            className={`bi ${
              isEditMode ? "bi-pencil-square" : "bi-plus-circle"
            } me-2`}
          ></i>

          {isEditMode
            ? "Modifier la catégorie"
            : "Ajouter une nouvelle catégorie"}
        </h5>

        {isEditMode && (
          <span className="badge bg-white text-dark">
            ID : {categorieAModifier.id}
          </span>
        )}
      </div>

      <div className="card-body">
        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Nom <span className="text-danger">*</span>
              </label>

              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-tag text-primary"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Ex : Ordinateurs"
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Description
              </label>

              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-card-text text-primary"></i>
                </span>

                <input
                  type="text"
                  className="form-control"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description de la catégorie"
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4">
            {isEditMode && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleAnnuler}
                disabled={loading}
              >
                <i className="bi bi-x-circle me-1"></i>
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Enregistrement...
                </>
              ) : (
                <>
                  <i
                    className={`bi ${
                      isEditMode
                        ? "bi-check-circle"
                        : "bi-plus-lg"
                    } me-1`}
                  ></i>

                  {isEditMode
                    ? "Enregistrer les modifications"
                    : "Ajouter la catégorie"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AjouterCategorie;