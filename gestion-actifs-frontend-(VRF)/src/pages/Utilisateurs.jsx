import { useEffect, useState } from "react";
import { getUtilisateurs } from "../services/utilisateurService";
import AjouterUtilisateur from "../components/AjouterUtilisateur";
import api from "../services/api";

function Utilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [utilisateurSelectionne, setUtilisateurSelectionne] =
    useState(null);

  const [utilisateurASupprimer, setUtilisateurASupprimer] =
    useState(null);

  // =========================================================
  // CHARGER LES UTILISATEURS
  // =========================================================

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  const chargerUtilisateurs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getUtilisateurs();

      setUtilisateurs(response.data || []);
    } catch (error) {
      console.error("Erreur API :", error);

      setError(
        "Impossible de récupérer les utilisateurs."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UTILISATEUR AJOUTÉ
  // =========================================================

  const handleUtilisateurAjoute = (nouvelUtilisateur) => {
    setUtilisateurs((prev) => [
      ...prev,
      nouvelUtilisateur,
    ]);
  };

  // =========================================================
  // UTILISATEUR MODIFIÉ
  // =========================================================

  const handleUtilisateurModifie = (utilisateurModifie) => {
    setUtilisateurs((prev) =>
      prev.map((utilisateur) =>
        utilisateur.id === utilisateurModifie.id
          ? utilisateurModifie
          : utilisateur
      )
    );

    setUtilisateurSelectionne(null);
  };

  // =========================================================
  // MODIFIER
  // =========================================================

  const handleModifierClick = (utilisateur) => {
    setUtilisateurSelectionne(utilisateur);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // SUPPRIMER
  // =========================================================

  const handleConfirmSupprimer = async () => {
    if (!utilisateurASupprimer) {
      return;
    }

    try {
      console.log(
        "Suppression utilisateur :",
        utilisateurASupprimer.id
      );

      // IMPORTANT :
      // On utilise api.delete() et non fetch().
      // api.js ajoute automatiquement le JWT.
      await api.delete(
        `/utilisateurs/${utilisateurASupprimer.id}`
      );

      // Supprimer de la liste affichée
      setUtilisateurs((prev) =>
        prev.filter(
          (utilisateur) =>
            utilisateur.id !== utilisateurASupprimer.id
        )
      );

      // Si l'utilisateur supprimé était en modification
      if (
        utilisateurSelectionne?.id ===
        utilisateurASupprimer.id
      ) {
        setUtilisateurSelectionne(null);
      }

      alert("Utilisateur supprimé avec succès.");

    } catch (error) {
      console.error(
        "Erreur suppression utilisateur :",
        error
      );

      if (error.response?.status === 401) {
        alert(
          "Votre session a expiré. Veuillez vous reconnecter."
        );
      } else if (error.response?.status === 403) {
        alert(
          "Accès refusé : seuls les administrateurs peuvent supprimer un utilisateur."
        );
      } else if (error.response?.status === 404) {
        alert(
          "Utilisateur introuvable."
        );
      } else {
        alert(
          "Erreur lors de la suppression de l'utilisateur."
        );
      }

    } finally {
      setUtilisateurASupprimer(null);
    }
  };

  // =========================================================
  // BADGE ROLE
  // =========================================================

  const getRoleBadge = (role) => {
    if (role === "ADMIN") {
      return (
        <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
          <i className="bi bi-shield-check me-1"></i>
          Administrateur
        </span>
      );
    }

    if (role === "TECHNICIEN") {
      return (
        <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
          <i className="bi bi-tools me-1"></i>
          Technicien
        </span>
      );
    }

    return (
      <span className="badge bg-info-subtle text-info border border-info-subtle">
        <i className="bi bi-person me-1"></i>
        {role || "Utilisateur"}
      </span>
    );
  };

  // =========================================================
  // CHARGEMENT
  // =========================================================

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5 py-5">
        <div
          className="spinner-border text-primary me-3"
          role="status"
        ></div>

        <span className="fs-5 text-muted">
          Chargement des utilisateurs...
        </span>
      </div>
    );
  }

  // =========================================================
  // ERREUR
  // =========================================================

  if (error) {
    return (
      <div className="container mt-4">
        <div
          className="alert alert-danger shadow-sm"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  // =========================================================
  // AFFICHAGE
  // =========================================================

  return (
    <div className="container py-4">

      {/* =====================================================
          EN-TÊTE
      ====================================================== */}

      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">

        <div>
          <h1 className="h3 mb-1 text-dark fw-bold">
            <i className="bi bi-people text-primary me-2"></i>
            Gestion des utilisateurs
          </h1>

          <p className="text-muted small mb-0">
            Gérez les comptes, rôles et services des utilisateurs.
          </p>
        </div>

        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill fs-6 px-3 py-2">
          Total : {utilisateurs.length}
        </span>
      </div>

      {/* =====================================================
          FORMULAIRE AJOUT / MODIFICATION
      ====================================================== */}

      <AjouterUtilisateur
        utilisateurAModifier={utilisateurSelectionne}
        onUtilisateurAjoute={handleUtilisateurAjoute}
        onUtilisateurModifie={handleUtilisateurModifie}
        onAnnuler={() =>
          setUtilisateurSelectionne(null)
        }
      />

      {/* =====================================================
          LISTE DES UTILISATEURS
      ====================================================== */}

      <div className="card shadow-sm border-0 mt-4">

        <div className="card-header bg-white py-3">
          <h5 className="card-title mb-0 text-dark fw-bold">
            <i className="bi bi-person-lines-fill text-secondary me-2"></i>
            Liste des utilisateurs
          </h5>
        </div>

        <div className="card-body p-0">

          {utilisateurs.length === 0 ? (

            <div className="p-5 text-center text-muted">

              <i className="bi bi-people fs-1 d-block mb-2"></i>

              <div>
                Aucun utilisateur trouvé.
              </div>

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Poste</th>
                    <th>Service</th>
                    <th className="text-end pe-3">
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {utilisateurs.map((utilisateur) => (

                    <tr key={utilisateur.id}>

                      {/* ID */}

                      <td>
                        <span className="badge bg-light text-dark border">
                          #{utilisateur.id}
                        </span>
                      </td>

                      {/* NOM */}

                      <td className="fw-semibold text-dark">

                        <i className="bi bi-person-circle text-primary me-2"></i>

                        {utilisateur.nom}

                      </td>

                      {/* EMAIL */}

                      <td>

                        <span className="text-muted">

                          <i className="bi bi-envelope me-1"></i>

                          {utilisateur.email}

                        </span>

                      </td>

                      {/* ROLE */}

                      <td>
                        {getRoleBadge(
                          utilisateur.role
                        )}
                      </td>

                      {/* POSTE */}

                      <td>

                        {utilisateur.poste ? (

                          <span className="badge bg-secondary-subtle text-dark border">

                            <i className="bi bi-briefcase me-1"></i>

                            {utilisateur.poste}

                          </span>

                        ) : (

                          <span className="text-muted small">
                            -
                          </span>

                        )}

                      </td>

                      {/* SERVICE */}

                      <td>

                        {utilisateur.service ? (

                          <span className="badge bg-light text-dark border">

                            <i className="bi bi-building me-1"></i>

                            {utilisateur.service}

                          </span>

                        ) : (

                          <span className="text-muted small">
                            Non renseigné
                          </span>

                        )}

                      </td>

                      {/* ACTIONS */}

                      <td className="text-end pe-3">

                        <div className="btn-group btn-group-sm">

                          {/* MODIFIER */}

                          <button
                            type="button"
                            className="btn btn-outline-warning"
                            onClick={() =>
                              handleModifierClick(
                                utilisateur
                              )
                            }
                          >
                            <i className="bi bi-pencil me-1"></i>
                            Modifier
                          </button>

                          {/* SUPPRIMER */}

                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() =>
                              setUtilisateurASupprimer(
                                utilisateur
                              )
                            }
                          >
                            <i className="bi bi-trash me-1"></i>
                            Supprimer
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          MODAL CONFIRMATION SUPPRESSION
      ====================================================== */}

      {utilisateurASupprimer && (

        <div
          className="modal fade show d-block bg-dark bg-opacity-50"
          tabIndex="-1"
        >

          <div className="modal-dialog modal-dialog-centered">

            <div className="modal-content shadow border-0">

              {/* HEADER */}

              <div className="modal-header bg-danger text-white">

                <h5 className="modal-title fs-6 fw-bold">

                  <i className="bi bi-exclamation-triangle-fill me-2"></i>

                  Confirmation

                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() =>
                    setUtilisateurASupprimer(null)
                  }
                ></button>

              </div>

              {/* BODY */}

              <div className="modal-body">

                Êtes-vous sûr de vouloir supprimer
                l'utilisateur{" "}

                <strong>
                  {utilisateurASupprimer.nom}
                </strong>

                ?

              </div>

              {/* FOOTER */}

              <div className="modal-footer bg-light">

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    setUtilisateurASupprimer(null)
                  }
                >
                  Annuler
                </button>

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

export default Utilisateurs;