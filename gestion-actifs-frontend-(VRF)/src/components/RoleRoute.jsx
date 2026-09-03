import { Navigate, Outlet } from "react-router-dom";
import { getRole, isAuthenticated } from "../services/authService";

// Ce composant protège une route selon le(s) rôle(s) autorisé(s).
// Il doit être utilisé à l'intérieur de PrivateRoute (l'authentification
// est donc déjà vérifiée), mais on la revérifie ici par sécurité.
function RoleRoute({ allowedRoles }) {

    if (!isAuthenticated()) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    const role = (getRole() || "").toUpperCase();

    const roleAutorise =
        !allowedRoles ||
        allowedRoles
            .map((r) => r.toUpperCase())
            .includes(role);

    if (!roleAutorise) {

        // L'utilisateur est connecté mais n'a pas le droit d'accéder
        // à cette page : on le redirige vers le tableau de bord plutôt
        // que de lui laisser afficher un formulaire qui échouera côté backend.
        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }

    return <Outlet />;
}

export default RoleRoute;
