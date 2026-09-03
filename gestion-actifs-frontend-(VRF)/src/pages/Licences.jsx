import { useEffect, useState } from "react";
import { getLicences } from "../services/licenceService";
import AjouterLicence from "../components/AjouterLicence";
import DemanderLicence from "./DemanderLicence";
import api from "../services/api";
import { getRole } from "../services/authService";

function Licences() {
  const [licences, setLicences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [licenceSelectionnee, setLicenceSelectionnee] = useState(null);
  const [licenceASupprimer, setLicenceASupprimer] = useState(null);

  // L'administrateur et le technicien peuvent ajouter, modifier ou
  // supprimer une licence (le backend renvoie 403 pour l'utilisateur normal).
  const role = (getRole() || "").toUpperCase();
  const isAdmin =
    role === "ADMIN" ||
    role === "ADMINISTRATEUR" ||
    role === "TECHNICIEN";

  useEffect(() => {
    getLicences()
      .then((response) => {
        setLicences(response.data);
      })
      .catch((error) => {
        console.error("Erreur API :", error);
        setError("Impossible de récupérer les licences.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Cette fonction ajoute une nouvelle licence dans la liste affichée.
  const handleLicenceAjoutee = (nouvelleLicence) => {
    setLicences((prev) => [...prev, nouvelleLicence]);
  };

  // Cette fonction remplace la licence modifiée dans la liste.
  const handleLicenceModifiee = (licenceModifiee) => {
    setLicences((prev) =>
      prev.map((licence) =>
        licence.id === licenceModifiee.id
          ? licenceModifiee
          : licence
      )
    );

    setLicenceSelectionnee(null);
  };

  // Cette fonction sélectionne une licence pour la modification.
  const handleModifierClick = (licence) => {
    setLicenceSelectionnee(licence);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cette fonction supprime définitivement une licence.
  const handleConfirmSupprimer = async () => {
    if (!licenceASupprimer) {
      return;
    }

    try {
      // Cette requête utilise Axios afin que le JWT soit ajouté automatiquement.
      await api.delete(
        `/licences/${licenceASupprimer.id}`
      );

      // Cette partie supprime la licence de l'affichage.
      setLicences((prev) =>
        prev.filter(
          (licence) =>
            licence.id !== licenceASupprimer.id
        )
      );

      // Cette partie ferme le formulaire de modification si nécessaire.
      if (
        licenceSelectionnee?.id ===
        licenceASupprimer.id
      ) {
        setLicenceSelectionnee(null);
      }

      // Cette partie ferme la fenêtre de confirmation.
      setLicenceASupprimer(null);

      console.log("Licence supprimée avec succès.");

    } catch (error) {
      console.error(
        "Erreur lors de la suppression :",
        error
      );

      // Cette partie affiche un message spécifique lorsque Spring retourne 403.
      if (error.response?.status === 403) {
        alert(
          "Accès refusé. Vous devez être administrateur pour supprimer une licence."
        );
      } else if (error.response?.status === 401) {
        alert(
          "Votre session a expiré. Veuillez vous reconnecter."
        );
      } else {
        alert(
          "Erreur lors de la suppression de la licence."
        );
      }
    }
  };

  // Cette fonction affiche un badge selon la date d'expiration.
  const getBadgeExpiration = (dateStr) => {
    if (!dateStr) {
      return (
        <span className="text-muted small">
          N/A
        </span>
      );
    }

    const dateExp = new Date(dateStr);
    const aujourdhui = new Date();

    const diffJours = Math.ceil(
      (dateExp - aujourdhui) /
        (1000 * 60 * 60 * 24)
    );

    if (diffJours < 0) {
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
          <i className="bi bi-x-circle me-1"></i>
          Expirée ({dateStr})
        </span>
      );
    }

    if (diffJours <= 30) {
      return (
        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
          <i className="bi bi-exclamation-triangle me-1"></i>
          Bientôt ({dateStr})
        </span>
      );
    }

    return (
      <span className="badge bg-light text-dark border">
        <i className="bi bi-calendar3 me-1 text-primary"></i>
        {dateStr}
      </span>
    );
  };

  // Cette partie filtre les licences selon le nom ou l'éditeur.
  const licencesFiltrees = licences.filter(
    (licence) =>
      licence.nom
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      licence.editeur
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Pour l'utilisateur normal, cette page est un formulaire de demande
  // d'accès à une licence, pas le catalogue de gestion réservé à
  // l'Admin (et consulté par le Technicien).
  if (role === "UTILISATEUR") {
    return <DemanderLicence />;
  }

  // Cette partie affiche l'écran de chargement.
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5 py-5">
        <div
          className="spinner-border text-primary me-3"
          role="status"
        ></div>

        <span className="fs-5 text-muted">
          Chargement des licences...
        </span>
      </div>
    );
  }

  // Cette partie affiche une erreur lorsque la récupération échoue.
  if (error) {
    return (
      <div className="container mt-4">
        <div
          className="alert alert-danger d-flex align-items-center shadow-sm"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>

          <div>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">

      {/* En-tête de la page */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">

        <div>
          <h1 className="h3 mb-1 text-dark fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-key-fill text-primary"></i>

            Gestion des Licences
          </h1>

          <p className="text-muted small mb-0">
            Suivez vos licences logicielles, dates
            d'expiration et attributions.
          </p>
        </div>

        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill fs-6 px-3 py-2">
          Total : {licences.length}
        </span>
      </div>

      {/* Formulaire d'ajout et de modification (réservé à l'administrateur) */}
      {isAdmin && (
        <AjouterLicence
          licenceAModifier={licenceSelectionnee}
          onLicenceAjoutee={handleLicenceAjoutee}
          onLicenceModifiee={handleLicenceModifiee}
          onAnnuler={() =>
            setLicenceSelectionnee(null)
          }
        />
      )}

      {/* Tableau des licences */}
      <div className="card shadow-sm border-0">

        <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">

          <h5 className="card-title mb-0 text-dark fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-list-task text-secondary"></i>

            Licences enregistrées
          </h5>

          {/* Barre de recherche */}
          <div
            className="input-group input-group-sm"
            style={{ maxWidth: "280px" }}
          >
            <span className="input-group-text bg-light border-end-0">
              <i className="bi bi-search text-muted"></i>
            </span>

            <input
              type="text"
              className="form-control bg-light border-start-0"
              placeholder="Rechercher par nom ou éditeur..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
            />
          </div>
        </div>

        <div className="card-body p-0">

          {licencesFiltrees.length === 0 ? (

            <div className="p-5 text-center text-muted">
              <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>

              Aucune licence ne correspond à la recherche.
            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">
                  <tr>
                    <th>Nom</th>
                    <th>Éditeur</th>
                    <th>Date d'expiration</th>
                    <th>Postes</th>
                    {isAdmin && (
                      <th className="text-end pe-3">
                        Actions
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody>

                  {licencesFiltrees.map((licence) => (

                    <tr key={licence.id}>

                      <td className="fw-semibold text-dark">
                        {licence.nom}
                      </td>

                      <td>

                        {licence.editeur ? (

                          <span className="badge bg-light text-secondary border">
                            {licence.editeur}
                          </span>

                        ) : (

                          <span className="text-muted small">
                            N/A
                          </span>

                        )}

                      </td>

                      <td>
                        {getBadgeExpiration(
                          licence.dateExpiration
                        )}
                      </td>

                      <td>

                        {licence.nbPostes !== null &&
                        licence.nbPostes !== undefined ? (

                          <span className="badge bg-info-subtle text-info-emphasis border border-info-subtle">

                            <i className="bi bi-laptop me-1"></i>

                            {licence.nbPostes}

                          </span>

                        ) : (

                          <span className="text-muted small">
                            N/A
                          </span>

                        )}

                      </td>

                      {isAdmin && (

                        <td className="text-end pe-3">

                          <div className="btn-group btn-group-sm">

                            {/* Bouton modifier */}
                            <button
                              className="btn btn-outline-warning"
                              onClick={() =>
                                handleModifierClick(
                                  licence
                                )
                              }
                              title="Modifier"
                            >
                              <i className="bi bi-pencil me-1"></i>

                              Modifier
                            </button>

                            {/* Bouton supprimer */}
                            <button
                              className="btn btn-outline-danger"
                              onClick={() =>
                                setLicenceASupprimer(
                                  licence
                                )
                              }
                              title="Supprimer"
                            >
                              <i className="bi bi-trash me-1"></i>

                              Supprimer
                            </button>

                          </div>

                        </td>

                      )}

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>
      </div>

      {/* Fenêtre de confirmation */}
      {licenceASupprimer && (

        <div
          className="modal fade show d-block bg-dark bg-opacity-50"
          tabIndex="-1"
          role="dialog"
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content shadow border-0">

              <div className="modal-header bg-danger text-white">

                <h5 className="modal-title fs-6 fw-bold">

                  <i className="bi bi-exclamation-triangle-fill me-2"></i>

                  Confirmation de suppression

                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setLicenceASupprimer(null)
                  }
                ></button>

              </div>

              <div className="modal-body">

                Êtes-vous sûr de vouloir supprimer la licence{" "}

                <strong>
                  {licenceASupprimer.nom}
                </strong>

                ? Cette action est définitive.

              </div>

              <div className="modal-footer bg-light">

                {/* Annuler */}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    setLicenceASupprimer(null)
                  }
                >
                  Annuler
                </button>

                {/* Confirmer la suppression */}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={handleConfirmSupprimer}
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

export default Licences;