import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, logout } from "../services/authService";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        motDePasse: ""
    });

    const [erreur, setErreur] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErreur("");
        setLoading(true);

        try {

            // Supprimer l'ancienne session avant la nouvelle connexion
            logout();

            const response = await login(
                formData.email,
                formData.motDePasse
            );

            console.log("Connexion réussie :", response);

            const role = (
                response.role || ""
            ).toUpperCase();

            if (
                role === "ADMIN" ||
                role === "ADMINISTRATEUR"
            ) {

                navigate("/dashboard", {
                    replace: true
                });

            } else if (role === "TECHNICIEN") {

                navigate("/dashboard", {
                    replace: true
                });

            } else {

                navigate("/espace-utilisateur", {
                    replace: true
                });
            }

        } catch (error) {

            console.error("Erreur login :", error);

            setErreur(
                error.response?.data?.message ||
                "Email ou mot de passe incorrect."
            );

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="container d-flex justify-content-center align-items-center min-vh-100">

            <div
                className="card shadow-sm border-0"
                style={{
                    width: "100%",
                    maxWidth: "450px"
                }}
            >

                <div className="card-body p-4">

                    <div className="text-center mb-4">

                        <i
                            className="bi bi-pc-display"
                            style={{
                                fontSize: "50px"
                            }}
                        />

                        <h2 className="fw-bold mt-2">
                            Gestion Actifs
                        </h2>

                        <p className="text-muted">
                            Connexion à votre espace
                        </p>

                    </div>

                    {erreur && (

                        <div className="alert alert-danger">
                            {erreur}
                        </div>

                    )}

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="exemple@email.com"
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="form-label">
                                Mot de passe
                            </label>

                            <input
                                type="password"
                                name="motDePasse"
                                className="form-control"
                                value={formData.motDePasse}
                                onChange={handleChange}
                                placeholder="Votre mot de passe"
                                required
                            />

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                    />

                                    Connexion...
                                </>

                            ) : (

                                <>
                                    <i className="bi bi-box-arrow-in-right me-2" />

                                    Se connecter
                                </>

                            )}

                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default Login;