import { useEffect, useState } from "react";
import { getMaintenances } from "../services/maintenanceService";
import AjouterMaintenance from "../components/AjouterMaintenance";
import DemanderMaintenance from "./DemanderMaintenance";
import api from "../services/api";
import { getRole } from "../services/authService";

function Maintenances() {
  // L'administrateur et le technicien peuvent gérer les maintenances ;
  // l'utilisateur normal ne peut que les consulter (voir SecurityConfig
  // backend : POST/PUT/DELETE /api/maintenances -> ADMIN, TECHNICIEN).
  const role = (getRole() || "").toUpperCase();
  const peutGererMaintenances =
    role === "ADMIN" ||
    role === "ADMINISTRATEUR" ||
    role === "TECHNICIEN";

  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [maintenanceSelectionnee, setMaintenanceSelectionnee] = useState(null);
  const [maintenanceASupprimer, setMaintenanceASupprimer] = useState(null);

  // Cette partie récupère les maintenances au chargement de la page.
  useEffect(() => {
    chargerMaintenances();
  }, []);

  // Cette méthode récupère les maintenances depuis le backend.
  const chargerMaintenances = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getMaintenances();

      setMaintenances(response.data);
    } catch (error) {
      console.error("Erreur API :", error);

      if (error.response) {
        console.error("Status :", error.response.status);
        console.error("Réponse :", error.response.data);
      }

      setError("Impossible de récupérer les maintenances.");
    } finally {
      setLoading(false);
    }
  };

  // Cette méthode ajoute la nouvelle maintenance dans le tableau.
  const handleMaintenanceAjoutee = (nouvelleMaintenance) => {
    setMaintenances((prev) => [
      ...prev,
      nouvelleMaintenance,
    ]);
  };

  // Cette méthode met à jour une maintenance dans le tableau.
  const handleMaintenanceModifiee = (maintenanceModifiee) => {
    setMaintenances((prev) =>
      prev.map((m) =>
        m.id === maintenanceModifiee.id
          ? maintenanceModifiee
          : m
      )
    );

    setMaintenanceSelectionnee(null);
  };

  // Cette méthode sélectionne une maintenance pour la modification.
  const handleModifierClick = (maintenance) => {
    setMaintenanceSelectionnee(maintenance);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Cette méthode supprime définitivement une maintenance.
  const handleConfirmSupprimer = async () => {
    if (!maintenanceASupprimer) {
      return;
    }

    try {
      // Cette requête utilise Axios et l'intercepteur ajoute automatiquement le JWT.
      const response = await api.delete(
        `/maintenances/${maintenanceASupprimer.id}`
      );

      console.log(
        "Suppression maintenance :",
        response.status
      );

      // Cette partie retire la maintenance de l'affichage.
      setMaintenances((prev) =>
        prev.filter(
          (m) => m.id !== maintenanceASupprimer.id
        )
      );

      // Cette partie ferme le formulaire si la maintenance supprimée était sélectionnée.
      if (
        maintenanceSelectionnee &&
        maintenanceSelectionnee.id === maintenanceASupprimer.id
      ) {
        setMaintenanceSelectionnee(null);
      }

      alert("Maintenance supprimée avec succès.");

    } catch (error) {
      console.error(
        "Erreur lors de la suppression :",
        error
      );

      if (error.response) {
        console.error(
          "Status :",
          error.response.status
        );

        console.error(
          "Réponse backend :",
          error.response.data
        );
      }

      if (error.response?.status === 401) {
        alert(
          "Votre session a expiré. Veuillez vous reconnecter."
        );
      } else if (error.response?.status === 403) {
        alert(
          "Vous n'avez pas l'autorisation de supprimer cette maintenance."
        );
      } else {
        alert(
          "Erreur lors de la suppression de la maintenance."
        );
      }

    } finally {
      setMaintenanceASupprimer(null);
    }
  };

  // Cette méthode définit le badge selon le type de maintenance.
  const getTypeBadge = (type) => {
    switch (type) {
      case "Préventive":
        return (
          <span className="badge bg-success-subtle text-success border border-success-subtle">
            Préventive
          </span>
        );

      case "Corrective":
        return (
          <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle">
            Corrective
          </span>
        );

      case "Réparation":
        return (
          <span className="badge bg-danger-subtle text-danger border border-danger-subtle">
            Réparation
          </span>
        );

      default:
        return (
          <span className="badge bg-secondary-subtle text-secondary">
            {type || "N/A"}
          </span>
        );
    }
  };

  // Cette méthode exporte les maintenances filtrées au format CSV.
  const exportToCSV = () => {
    if (maintenancesFiltrees.length === 0) {
      return;
    }

    const headers = [
      "ID",
      "Actif",
      "Type",
      "Date",
      "Description",
      "Coût (DT)",
    ];

    const rows = maintenancesFiltrees.map((m) => [
      m.id,
      `"${(m.actif?.nom || "").replace(/"/g, '""')}"`,
      m.type || "",
      m.date || "",
      `"${(m.description || "").replace(/"/g, '""')}"`,
      m.cout != null ? m.cout : "",
    ]);

    const csvContent =
      "\uFEFF" +
      [
        headers.join(";"),
        ...rows.map((row) => row.join(";")),
      ].join("\n");

    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    const dateAujourdhui =
      new Date().toISOString().split("T")[0];

    link.setAttribute("href", url);

    link.setAttribute(
      "download",
      `maintenances_export_${dateAujourdhui}.csv`
    );

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // Cette partie filtre les maintenances selon la recherche et le type.
  const maintenancesFiltrees = maintenances.filter((m) => {
    const texteRecherche =
      searchTerm.toLowerCase();

    const matchSearch =
      m.actif?.nom
        ?.toLowerCase()
        .includes(texteRecherche) ||
      m.description
        ?.toLowerCase()
        .includes(texteRecherche);

    const matchType =
      filterType === "" ||
      m.type === filterType;

    return matchSearch && matchType;
  });

  // Pour l'utilisateur normal, cette page est un formulaire de demande
  // (signaler un problème), pas le tableau de gestion réservé à
  // l'Admin/Technicien.
  if (!peutGererMaintenances) {
    return <DemanderMaintenance />;
  }

  // Cette partie affiche le chargement.
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-5 py-5">
        <div
          className="spinner-border text-primary me-3"
          role="status"
        ></div>

        <span className="fs-5 text-muted">
          Chargement des maintenances...
        </span>
      </div>
    );
  }

  // Cette partie affiche les erreurs.
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
            <i className="bi bi-wrench-adjustable-circle text-primary"></i>

            Gestion des Maintenances
          </h1>

          <p className="text-muted small mb-0">
            Suivez les interventions préventives,
            correctives et réparations de vos actifs.
          </p>
        </div>

        <span className="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill fs-6 px-3 py-2">
          Total : {maintenances.length}
        </span>
      </div>

      {/* Formulaire d'ajout et de modification (admin / technicien) */}
      {peutGererMaintenances && (
        <AjouterMaintenance
          maintenanceAModifier={maintenanceSelectionnee}
          onMaintenanceAjoutee={handleMaintenanceAjoutee}
          onMaintenanceModifiee={handleMaintenanceModifiee}
          onAnnuler={() =>
            setMaintenanceSelectionnee(null)
          }
        />
      )}

      {/* Tableau des maintenances */}
      <div className="card shadow-sm border-0">

        <div className="card-header bg-white py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">

          <h5 className="card-title mb-0 text-dark fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-list-check text-secondary"></i>

            Historique des interventions
          </h5>

          <div className="d-flex align-items-center gap-2 flex-wrap">

            {/* Bouton export CSV */}
            <button
              type="button"
              className="btn btn-outline-success btn-sm d-flex align-items-center gap-1"
              onClick={exportToCSV}
              disabled={
                maintenancesFiltrees.length === 0
              }
              title="Exporter au format CSV"
            >
              <i className="bi bi-file-earmark-excel"></i>

              Exporter CSV
            </button>

            {/* Filtre par type */}
            <select
              className="form-select form-select-sm bg-light"
              style={{ width: "150px" }}
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value)
              }
            >
              <option value="">
                Tous les types
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

            {/* Recherche */}
            <div
              className="input-group input-group-sm"
              style={{ maxWidth: "240px" }}
            >
              <span className="input-group-text bg-light border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>

              <input
                type="text"
                className="form-control bg-light border-start-0"
                placeholder="Rechercher actif, desc..."
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

          </div>
        </div>

        <div className="card-body p-0">

          {maintenancesFiltrees.length === 0 ? (

            <div className="p-5 text-center text-muted">

              <i className="bi bi-inbox fs-1 d-block mb-2 text-secondary"></i>

              Aucune maintenance ne correspond à la recherche.

            </div>

          ) : (

            <div className="table-responsive">

              <table className="table table-hover align-middle mb-0">

                <thead className="table-light">

                  <tr>
                    <th>Actif</th>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Coût</th>
                    {peutGererMaintenances && (
                      <th className="text-end pe-3">
                        Actions
                      </th>
                    )}
                  </tr>

                </thead>

                <tbody>

                  {maintenancesFiltrees.map((m) => (

                    <tr key={m.id}>

                      <td className="fw-semibold text-dark">

                        <i className="bi bi-pc-display text-muted me-1"></i>

                        {m.actif?.nom || (
                          <span className="text-muted small">
                            N/A
                          </span>
                        )}

                      </td>

                      <td>
                        {getTypeBadge(m.type)}
                      </td>

                      <td>

                        <span className="badge bg-light text-dark border">

                          <i className="bi bi-calendar3 me-1 text-primary"></i>

                          {m.date || "N/A"}

                        </span>

                      </td>

                      <td style={{ maxWidth: "280px" }}>

                        <span
                          className="text-truncate d-block"
                          title={m.description}
                        >
                          {m.description || (
                            <span className="text-muted small">
                              Aucune description
                            </span>
                          )}
                        </span>

                      </td>

                      <td className="fw-semibold text-dark">

                        {m.cout != null ? (

                          <span className="badge bg-light text-dark border">
                            {Number(m.cout).toFixed(2)} DT
                          </span>

                        ) : (

                          <span className="text-muted small">
                            N/A
                          </span>

                        )}

                      </td>

                      {peutGererMaintenances && (

                        <td className="text-end pe-3">

                          <div className="btn-group btn-group-sm">

                            {/* Bouton modifier */}
                            <button
                              className="btn btn-outline-warning"
                              onClick={() =>
                                handleModifierClick(m)
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
                                setMaintenanceASupprimer(m)
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

      {/* Fenêtre de confirmation de suppression */}
      {maintenanceASupprimer && (

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
                    setMaintenanceASupprimer(null)
                  }
                ></button>

              </div>

              <div className="modal-body">

                Êtes-vous sûr de vouloir supprimer la
                maintenance pour l'actif{" "}

                <strong>
                  {maintenanceASupprimer.actif?.nom ||
                    "inconnu"}
                </strong>{" "}

                du{" "}

                <strong>
                  {maintenanceASupprimer.date}
                </strong>
                ?

                <br />

                <span className="text-danger">
                  Cette action est définitive.
                </span>

              </div>

              <div className="modal-footer bg-light">

                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() =>
                    setMaintenanceASupprimer(null)
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

export default Maintenances;