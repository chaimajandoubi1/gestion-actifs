import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
    getRole,
    getUtilisateurConnecte,
    logout
} from "../services/authService";

function Navbar() {

    const navigate = useNavigate();

    const [menuOuvert, setMenuOuvert] = useState(false);

    const role = getRole();
    const utilisateur = getUtilisateurConnecte();

    const isAdmin =
        role === "ADMIN" ||
        role === "ADMINISTRATEUR";

    const isTechnicien =
        role === "TECHNICIEN";

    const fermerMenu = () => {
        setMenuOuvert(false);
    };

    const handleLogout = () => {

        logout();

        fermerMenu();

        navigate("/login", {
            replace: true
        });
    };

    const lienClass = ({ isActive }) =>
        `nav-link ${isActive ? "active" : ""}`;

    return (
        <nav className="app-navbar">

            <div className="navbar-container">

                <NavLink
                    to={
                        isAdmin || isTechnicien
                            ? "/dashboard"
                            : "/espace-utilisateur"
                    }
                    className="navbar-brand"
                    onClick={fermerMenu}
                >

                    <span className="brand-icon">
                        <i className="bi bi-pc-display"></i>
                    </span>

                    <span className="brand-text">
                        Gestion Actifs
                    </span>

                </NavLink>


                <button
                    type="button"
                    className="navbar-toggle"
                    onClick={() =>
                        setMenuOuvert(!menuOuvert)
                    }
                    aria-label="Menu"
                >

                    <i
                        className={
                            menuOuvert
                                ? "bi bi-x-lg"
                                : "bi bi-list"
                        }
                    ></i>

                </button>


                <div
                    className={`navbar-links ${
                        menuOuvert ? "open" : ""
                    }`}
                >

                    {isAdmin && (
                        <>
                            <NavLink
                                to="/dashboard"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-speedometer2"></i>
                                <span>Dashboard</span>
                            </NavLink>

                            <NavLink
                                to="/actifs"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-pc-display"></i>
                                <span>Actifs</span>
                            </NavLink>

                            <NavLink
                                to="/categories"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-tags"></i>
                                <span>Catégories</span>
                            </NavLink>

                            <NavLink
                                to="/utilisateurs"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-people"></i>
                                <span>Utilisateurs</span>
                            </NavLink>

                            <NavLink
                                to="/affectations"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-person-check"></i>
                                <span>Affectations</span>
                            </NavLink>

                            <NavLink
                                to="/maintenances"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-tools"></i>
                                <span>Maintenances</span>
                            </NavLink>

                            <NavLink
                                to="/licences"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-key"></i>
                                <span>Licences</span>
                            </NavLink>

                            <NavLink
                                to="/demandes"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-inbox"></i>
                                <span>Demandes</span>
                            </NavLink>
                        </>
                    )}


                    {isTechnicien && (
                        <>
                            <NavLink
                                to="/dashboard"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-speedometer2"></i>
                                <span>Dashboard</span>
                            </NavLink>

                            <NavLink
                                to="/actifs"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-pc-display"></i>
                                <span>Mes actifs</span>
                            </NavLink>

                            <NavLink
                                to="/affectations"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-person-check"></i>
                                <span>Mes affectations</span>
                            </NavLink>

                            <NavLink
                                to="/maintenances"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-tools"></i>
                                <span>Maintenances</span>
                            </NavLink>

                            <NavLink
                                to="/licences"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-key"></i>
                                <span>Licences</span>
                            </NavLink>

                            <NavLink
                                to="/demandes"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-inbox"></i>
                                <span>Demandes</span>
                            </NavLink>
                        </>
                    )}


                    {!isAdmin && !isTechnicien && (
                        <>
                            <NavLink
                                to="/espace-utilisateur"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-person-workspace"></i>
                                <span>Mon espace</span>
                            </NavLink>

                            <NavLink
                                to="/actifs"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-pc-display"></i>
                                <span>Mes actifs</span>
                            </NavLink>

                            <NavLink
                                to="/affectations"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-person-check"></i>
                                <span>Mes affectations</span>
                            </NavLink>

                            <NavLink
                                to="/maintenances"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-tools"></i>
                                <span>Maintenances</span>
                            </NavLink>

                            <NavLink
                                to="/licences"
                                className={lienClass}
                                onClick={fermerMenu}
                            >
                                <i className="bi bi-key"></i>
                                <span>Licences</span>
                            </NavLink>
                        </>
                    )}

                </div>


                <div className="navbar-user">

                    <div className="user-avatar">
                        <i className="bi bi-person-fill"></i>
                    </div>

                    <div className="user-info">

                        <span className="user-name">
                            {utilisateur?.nom || "Utilisateur"}
                        </span>

                        <span className="user-role">
                            {role || "USER"}
                        </span>

                    </div>

                    <button
                        type="button"
                        className="logout-btn"
                        onClick={handleLogout}
                        title="Déconnexion"
                    >
                        <i className="bi bi-box-arrow-right"></i>

                        <span>
                            Déconnexion
                        </span>
                    </button>

                </div>

            </div>

        </nav>
    );
}

export default Navbar;