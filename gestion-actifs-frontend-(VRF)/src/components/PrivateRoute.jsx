import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

function PrivateRoute() {

    const authentifie = isAuthenticated();

    if (!authentifie) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <Outlet />;
}

export default PrivateRoute;