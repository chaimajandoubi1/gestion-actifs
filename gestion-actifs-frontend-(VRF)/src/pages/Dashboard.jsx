import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { getRole } from "../services/authService";

// Définit les cartes de l'administrateur.
const CARTES_ADMIN = [
    {
        cle: "actifs",
        titre: "Actifs",
        lien: "/actifs",
        icon: "bi-laptop",
        badgeBg: "bg-primary-subtle",
        textColor: "text-primary",
    },
    {
        cle: "categories",
        titre: "Catégories",
        lien: "/categories",
        icon: "bi-tags",
        badgeBg: "bg-purple-subtle",
        textColor: "text-purple",
    },
    {
        cle: "utilisateurs",
        titre: "Utilisateurs",
        lien: "/utilisateurs",
        icon: "bi-people",
        badgeBg: "bg-success-subtle",
        textColor: "text-success",
    },
    {
        cle: "affectations",
        titre: "Affectations",
        lien: "/affectations",
        icon: "bi-arrow-left-right",
        badgeBg: "bg-warning-subtle",
        textColor: "text-warning",
    },
    {
        cle: "maintenances",
        titre: "Maintenances",
        lien: "/maintenances",
        icon: "bi-tools",
        badgeBg: "bg-danger-subtle",
        textColor: "text-danger",
    },
    {
        cle: "licences",
        titre: "Licences",
        lien: "/licences",
        icon: "bi-key",
        badgeBg: "bg-info-subtle",
        textColor: "text-info",
    },
    {
        cle: "demandes",
        titre: "Demandes",
        lien: "/demandes",
        icon: "bi-inbox",
        badgeBg: "bg-orange-subtle",
        textColor: "text-orange",
    },
];

// Définit les cartes du technicien.
const CARTES_TECHNICIEN = [
    {
        cle: "actifs",
        titre: "Actifs",
        lien: "/actifs",
        icon: "bi-laptop",
        badgeBg: "bg-primary-subtle",
        textColor: "text-primary",
    },
    {
        cle: "affectations",
        titre: "Affectations",
        lien: "/affectations",
        icon: "bi-arrow-left-right",
        badgeBg: "bg-warning-subtle",
        textColor: "text-warning",
    },
    {
        cle: "maintenances",
        titre: "Maintenances",
        lien: "/maintenances",
        icon: "bi-tools",
        badgeBg: "bg-danger-subtle",
        textColor: "text-danger",
    },
    {
        cle: "licences",
        titre: "Licences",
        lien: "/licences",
        icon: "bi-key",
        badgeBg: "bg-info-subtle",
        textColor: "text-info",
    },
    {
        cle: "demandes",
        titre: "Demandes",
        lien: "/demandes",
        icon: "bi-inbox",
        badgeBg: "bg-orange-subtle",
        textColor: "text-orange",
    },
];

// Définit les cartes des autres utilisateurs.
const CARTES_AUTRES_ROLES = [
    {
        cle: "actifs",
        titre: "Mes actifs",
        lien: "/actifs",
        icon: "bi-laptop",
        badgeBg: "bg-primary-subtle",
        textColor: "text-primary",
    },
    {
        cle: "affectations",
        titre: "Mes affectations",
        lien: "/affectations",
        icon: "bi-arrow-left-right",
        badgeBg: "bg-warning-subtle",
        textColor: "text-warning",
    },
];

function Dashboard() {

    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    // Alertes : licences bientôt expirées + demandes en attente récentes
    // (réservées à l'ADMIN et au TECHNICIEN, qui ont accès à ces vues
    // globales — un simple utilisateur ne voit que ses propres données
    // et n'a pas la carte "Demandes" sur son tableau de bord).
    const [licencesAlerte, setLicencesAlerte] = useState([]);
    const [demandesRecentes, setDemandesRecentes] = useState([]);
    const [loadingAlertes, setLoadingAlertes] = useState(true);

    // Récupère le rôle de l'utilisateur connecté.
    const role = (getRole() || "").toUpperCase();

    const peutVoirAlertes =
        role === "ADMIN" ||
        role === "ADMINISTRATEUR" ||
        role === "TECHNICIEN";

    let cartes;

    // Sélectionne les cartes selon le rôle.
    if (
        role === "ADMIN" ||
        role === "ADMINISTRATEUR"
    ) {
        cartes = CARTES_ADMIN;
    } else if (role === "TECHNICIEN") {
        cartes = CARTES_TECHNICIEN;
    } else {
        cartes = CARTES_AUTRES_ROLES;
    }

    useEffect(() => {

        const chargerStats = async () => {

            setLoading(true);

            try {

                const resultats = await Promise.all(

                    cartes.map(async (carte) => {

                        try {

                            // Définit la route des affectations.
                            if (carte.cle === "affectations") {

                                let url;

                                if (
                                    role === "ADMIN" ||
                                    role === "ADMINISTRATEUR"
                                ) {
                                    url = "/affectations";
                                } else {
                                    url =
                                        "/affectations/mes-affectations";
                                }

                                const response = await api.get(url);
                                const data = response.data;

                                return {
                                    cle: carte.cle,
                                    count: Array.isArray(data)
                                        ? data.length
                                        : 0,
                                };
                            }

                            // La carte "Demandes" agrège les 3 types de
                            // demandes en attente (maintenance, actif, licence).
                            if (carte.cle === "demandes") {

                                const reponses = await Promise.all([
                                    api.get("/demandes-maintenance"),
                                    api.get("/demandes-actif"),
                                    api.get("/demandes-licence"),
                                ]);

                                const total = reponses.reduce(
                                    (somme, reponse) => {

                                        const liste = reponse.data;

                                        const enAttente = Array.isArray(liste)
                                            ? liste.filter(
                                                  (d) =>
                                                      d.statut ===
                                                      "EN_ATTENTE"
                                              ).length
                                            : 0;

                                        return somme + enAttente;
                                    },
                                    0
                                );

                                return {
                                    cle: carte.cle,
                                    count: total,
                                };
                            }

                            const url = `/${carte.cle}`;

                            // Envoie la requête vers le backend.
                            const response = await api.get(url);

                            const data = response.data;

                            return {
                                cle: carte.cle,
                                count: Array.isArray(data)
                                    ? data.length
                                    : 0,
                            };

                        } catch (error) {

                            console.error(
                                `Erreur API /${carte.cle} :`,
                                error
                            );

                            return {
                                cle: carte.cle,
                                count: 0,
                            };
                        }
                    })
                );

                const nouvellesStats = {};

                resultats.forEach(
                    ({ cle, count }) => {
                        nouvellesStats[cle] = count;
                    }
                );

                setStats(nouvellesStats);

            } finally {

                setLoading(false);

            }
        };

        chargerStats();

    }, [role]);

    // Charge les alertes : licences dont l'expiration approche (30 jours)
    // ou est dépassée, et les demandes en attente les plus récentes,
    // tous types confondus (maintenance, actif, licence).
    useEffect(() => {

        if (!peutVoirAlertes) {
            setLoadingAlertes(false);
            return;
        }

        const chargerAlertes = async () => {

            setLoadingAlertes(true);

            try {

                const [
                    licencesResp,
                    maintenanceResp,
                    actifResp,
                    licenceDemResp,
                ] = await Promise.all([
                    api.get("/licences"),
                    api.get("/demandes-maintenance"),
                    api.get("/demandes-actif"),
                    api.get("/demandes-licence"),
                ]);

                // Licences bientôt expirées ou déjà expirées, triées de
                // la plus urgente à la moins urgente.
                const dansTrenteJours = new Date();
                dansTrenteJours.setDate(
                    dansTrenteJours.getDate() + 30
                );

                const licencesUrgentes = (licencesResp.data || [])
                    .filter((licence) => licence.dateExpiration)
                    .filter(
                        (licence) =>
                            new Date(licence.dateExpiration) <=
                            dansTrenteJours
                    )
                    .sort(
                        (a, b) =>
                            new Date(a.dateExpiration) -
                            new Date(b.dateExpiration)
                    )
                    .slice(0, 5);

                setLicencesAlerte(licencesUrgentes);

                // Demandes en attente, tous types confondus, les plus
                // récentes en premier.
                const etiqueter = (liste, type, icon, lien) =>
                    (liste || [])
                        .filter(
                            (demande) =>
                                demande.statut === "EN_ATTENTE"
                        )
                        .map((demande) => ({
                            ...demande,
                            type,
                            icon,
                            lien,
                        }));

                const toutesDemandes = [
                    ...etiqueter(
                        maintenanceResp.data,
                        "Maintenance",
                        "bi-tools",
                        "/demandes"
                    ),
                    ...etiqueter(
                        actifResp.data,
                        "Actif",
                        "bi-pc-display",
                        "/demandes"
                    ),
                    ...etiqueter(
                        licenceDemResp.data,
                        "Licence",
                        "bi-key",
                        "/demandes"
                    ),
                ]
                    .sort(
                        (a, b) =>
                            new Date(b.dateCreation) -
                            new Date(a.dateCreation)
                    )
                    .slice(0, 5);

                setDemandesRecentes(toutesDemandes);

            } catch (error) {

                console.error(
                    "Erreur lors du chargement des alertes :",
                    error
                );

            } finally {

                setLoadingAlertes(false);

            }
        };

        chargerAlertes();

    }, [role, peutVoirAlertes]);

    // Définit le nom affiché pour chaque rôle.
    const nomRole =
        role === "ADMIN" ||
        role === "ADMINISTRATEUR"
            ? "Administrateur"
            : role === "TECHNICIEN"
            ? "Technicien"
            : role === "UTILISATEUR"
            ? "Utilisateur"
            : role || "Utilisateur";

    // Définit la description du tableau de bord.
    const description =
        role === "ADMIN" ||
        role === "ADMINISTRATEUR"
            ? "Vue d'ensemble de la plateforme de gestion des actifs informatiques."
            : role === "TECHNICIEN"
            ? "Vue d'ensemble des maintenances et des licences."
            : "Vue d'ensemble de vos ressources informatiques.";

    return (

        <div className="container my-4">

            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">

                <div className="d-flex align-items-center gap-3">

                    <div
                        className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                            width: "52px",
                            height: "52px",
                            background:
                                "linear-gradient(135deg, var(--blue), var(--mauve))",
                            color: "white",
                        }}
                    >
                        <i className="bi bi-speedometer2 fs-3"></i>
                    </div>

                    <div>
                        <h1 className="fw-bold text-dark mb-1">
                            Tableau de bord
                        </h1>

                        <p className="text-muted mb-0">
                            {description}
                        </p>
                    </div>

                </div>

                <span className="role-badge">
                    <i className="bi bi-person-fill me-1"></i>
                    {nomRole}
                </span>

            </div>

            <div className="row g-4">

                {cartes.map((carte) => (

                    <div
                        key={carte.cle}
                        className="col-12 col-sm-6 col-lg-4"
                    >

                        <Link
                            to={carte.lien}
                            className="card h-100 border-0 shadow-sm text-decoration-none dashboard-card"
                        >

                            <div className="card-body p-4">

                                <div className="d-flex align-items-center justify-content-between mb-3">

                                    <div
                                        className={`rounded-3 p-3 d-flex align-items-center justify-content-center ${carte.badgeBg}`}
                                        style={{
                                            width: "48px",
                                            height: "48px",
                                        }}
                                    >

                                        <i
                                            className={`bi ${carte.icon} fs-4 ${carte.textColor}`}
                                        />

                                    </div>

                                    <i className="bi bi-arrow-right text-muted fs-5 card-arrow" />

                                </div>

                                <div>

                                    {loading ? (

                                        <div className="placeholder-glow mb-2">

                                            <span className="placeholder col-6 fs-2 rounded" />

                                        </div>

                                    ) : (

                                        <h2 className="display-6 fw-bold text-dark mb-1">
                                            {stats[carte.cle] ?? 0}
                                        </h2>

                                    )}

                                    <p className="text-secondary fw-medium mb-0">
                                        {carte.titre}
                                    </p>

                                </div>

                            </div>

                        </Link>

                    </div>

                ))}

            </div>

            {peutVoirAlertes && (

                <div className="row g-4 mt-1">

                    {/* Licences bientôt expirées */}
                    <div className="col-12 col-lg-6">

                        <div className="card h-100 border-0 shadow-sm">

                            <div className="card-header bg-white d-flex align-items-center justify-content-between py-3">

                                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                    <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                                    Licences à surveiller
                                </h5>

                                <Link
                                    to="/licences"
                                    className="small text-decoration-none fw-semibold"
                                    style={{ color: "var(--purple-dark)" }}
                                >
                                    Voir tout
                                    <i className="bi bi-arrow-right ms-1"></i>
                                </Link>

                            </div>

                            <div className="card-body p-0">

                                {loadingAlertes ? (

                                    <div className="p-4 text-center text-muted">
                                        <div
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></div>
                                        Chargement...
                                    </div>

                                ) : licencesAlerte.length === 0 ? (

                                    <div className="p-4 text-center text-muted">
                                        <i className="bi bi-check-circle text-success fs-4 d-block mb-2"></i>
                                        Aucune licence n'expire dans les 30 prochains jours.
                                    </div>

                                ) : (

                                    <ul className="list-group list-group-flush">

                                        {licencesAlerte.map((licence) => {

                                            const expiree =
                                                new Date(
                                                    licence.dateExpiration
                                                ) < new Date();

                                            return (

                                                <li
                                                    key={licence.id}
                                                    className="list-group-item d-flex align-items-center justify-content-between px-4 py-3"
                                                >

                                                    <div>
                                                        <div className="fw-semibold text-dark">
                                                            {licence.nom}
                                                        </div>

                                                        <div className="small text-muted">
                                                            {licence.editeur || "Éditeur non renseigné"}
                                                        </div>
                                                    </div>

                                                    <span
                                                        className={`badge ${
                                                            expiree
                                                                ? "bg-danger-subtle text-danger border border-danger-subtle"
                                                                : "bg-warning-subtle text-warning-emphasis border border-warning-subtle"
                                                        }`}
                                                    >
                                                        {expiree
                                                            ? "Expirée"
                                                            : "Bientôt"}{" "}
                                                        · {licence.dateExpiration}
                                                    </span>

                                                </li>

                                            );
                                        })}

                                    </ul>

                                )}

                            </div>

                        </div>

                    </div>

                    {/* Demandes en attente récentes */}
                    <div className="col-12 col-lg-6">

                        <div className="card h-100 border-0 shadow-sm">

                            <div className="card-header bg-white d-flex align-items-center justify-content-between py-3">

                                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2">
                                    <i className="bi bi-inbox-fill text-primary"></i>
                                    Demandes en attente
                                </h5>

                                <Link
                                    to="/demandes"
                                    className="small text-decoration-none fw-semibold"
                                    style={{ color: "var(--purple-dark)" }}
                                >
                                    Voir tout
                                    <i className="bi bi-arrow-right ms-1"></i>
                                </Link>

                            </div>

                            <div className="card-body p-0">

                                {loadingAlertes ? (

                                    <div className="p-4 text-center text-muted">
                                        <div
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                        ></div>
                                        Chargement...
                                    </div>

                                ) : demandesRecentes.length === 0 ? (

                                    <div className="p-4 text-center text-muted">
                                        <i className="bi bi-check-circle text-success fs-4 d-block mb-2"></i>
                                        Aucune demande en attente.
                                    </div>

                                ) : (

                                    <ul className="list-group list-group-flush">

                                        {demandesRecentes.map((demande) => (

                                            <li
                                                key={`${demande.type}-${demande.id}`}
                                                className="list-group-item d-flex align-items-start gap-3 px-4 py-3"
                                            >

                                                <i
                                                    className={`bi ${demande.icon} fs-5 mt-1`}
                                                    style={{
                                                        color: "var(--purple-dark)",
                                                    }}
                                                ></i>

                                                <div className="flex-grow-1">

                                                    <div className="d-flex align-items-center gap-2">
                                                        <span className="fw-semibold text-dark">
                                                            {demande.utilisateur?.nom ||
                                                                "Utilisateur inconnu"}
                                                        </span>

                                                        <span className="badge bg-secondary-subtle text-secondary">
                                                            {demande.type}
                                                        </span>
                                                    </div>

                                                    <div className="small text-muted text-truncate">
                                                        {demande.description}
                                                    </div>

                                                </div>

                                                <span className="small text-muted flex-shrink-0">
                                                    {demande.dateCreation
                                                        ? new Date(
                                                              demande.dateCreation
                                                          ).toLocaleDateString()
                                                        : "-"}
                                                </span>

                                            </li>

                                        ))}

                                    </ul>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Dashboard;