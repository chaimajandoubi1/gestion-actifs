import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Navbar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import RoleRoute from "./components/RoleRoute";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Actifs from "./pages/Actifs";
import Affectations from "./pages/Affectations";
import Categories from "./pages/Categories";
import Utilisateurs from "./pages/Utilisateurs";
import Maintenances from "./pages/Maintenances";
import Licences from "./pages/Licences";
import EspaceUtilisateur from "./pages/EspaceUtilisateur";
import DemandeActif from "./pages/DemandeActif";
import DemanderLicence from "./pages/DemanderLicence";
import Demandes from "./pages/Demandes";

import AjouterActif from "./components/AjouterActif";
import AjouterAffectation from "./components/AjouterAffectation";

function Layout({ children }) {
    return (
        <>
            <Navbar />

            <main>
                {children}
            </main>
        </>
    );
}

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* La page de connexion est accessible sans authentification. */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Les routes suivantes nécessitent une authentification. */}
                <Route
                    element={<PrivateRoute />}
                >

                    {/* Le tableau de bord est accessible aux utilisateurs connectés. */}
                    <Route
                        path="/dashboard"
                        element={
                            <Layout>
                                <Dashboard />
                            </Layout>
                        }
                    />

                    {/* Cette route affiche la liste des actifs. */}
                    <Route
                        path="/actifs"
                        element={
                            <Layout>
                                <Actifs />
                            </Layout>
                        }
                    />

                    {/* Les routes suivantes (ajout/modification d'actifs)
                        sont réservées à l'administrateur : le technicien et
                        l'utilisateur normal n'ont qu'un accès en consultation. */}
                    <Route
                        element={
                            <RoleRoute allowedRoles={["ADMIN"]} />
                        }
                    >

                        {/* Cette route permet d'ajouter un nouvel actif. */}
                        <Route
                            path="/actifs/ajouter"
                            element={
                                <Layout>
                                    <AjouterActif />
                                </Layout>
                            }
                        />

                        {/* Cette route permet de modifier un actif existant. */}
                        <Route
                            path="/actifs/modifier/:id"
                            element={
                                <Layout>
                                    <AjouterActif />
                                </Layout>
                            }
                        />

                    </Route>

                    {/* Cette route affiche les affectations. */}
                    <Route
                        path="/affectations"
                        element={
                            <Layout>
                                <Affectations />
                            </Layout>
                        }
                    />

                    {/* La création et la modification d'affectations restent
                        réservées à l'administrateur. */}
                    <Route
                        element={
                            <RoleRoute allowedRoles={["ADMIN"]} />
                        }
                    >

                        {/* Cette route permet d'ajouter une affectation. */}
                        <Route
                            path="/affectations/ajouter"
                            element={
                                <Layout>
                                    <AjouterAffectation />
                                </Layout>
                            }
                        />

                        <Route
                            path="/affectations/modifier/:id"
                            element={
                                <Layout>
                                    <AjouterAffectation />
                                </Layout>
                            }
                        />

                    </Route>

                    {/* Les catégories et les utilisateurs restent des modules
                        exclusivement administrateur. */}
                    <Route
                        element={
                            <RoleRoute allowedRoles={["ADMIN"]} />
                        }
                    >

                        {/* Cette route affiche les catégories. */}
                        <Route
                            path="/categories"
                            element={
                                <Layout>
                                    <Categories />
                                </Layout>
                            }
                        />

                        {/* Cette route affiche les utilisateurs. */}
                        <Route
                            path="/utilisateurs"
                            element={
                                <Layout>
                                    <Utilisateurs />
                                </Layout>
                            }
                        />

                    </Route>

                    {/* Cette route affiche les maintenances. */}
                    <Route
                        path="/maintenances"
                        element={
                            <Layout>
                                <Maintenances />
                            </Layout>
                        }
                    />

                    {/* Cette route affiche les licences. */}
                    <Route
                        path="/licences"
                        element={
                            <Layout>
                                <Licences />
                            </Layout>
                        }
                    />

                    {/* Cette route affiche l'espace personnel de l'utilisateur
                        (le logo de la Navbar y renvoie pour les rôles non-admin
                        et non-technicien). */}
                    <Route
                        path="/espace-utilisateur"
                        element={
                            <Layout>
                                <EspaceUtilisateur />
                            </Layout>
                        }
                    />

                    {/* Ces routes permettent à tout utilisateur connecté de
                        demander un actif ou l'accès à une licence. */}
                    <Route
                        path="/demande-actif"
                        element={
                            <Layout>
                                <DemandeActif />
                            </Layout>
                        }
                    />

                    <Route
                        path="/demander-licence"
                        element={
                            <Layout>
                                <DemanderLicence />
                            </Layout>
                        }
                    />

                    {/* Cette route (page "Demandes") permet à l'administrateur
                        et au technicien de consulter et traiter les demandes
                        de maintenance, d'actif et de licence des utilisateurs. */}
                    <Route
                        element={
                            <RoleRoute allowedRoles={["ADMIN", "TECHNICIEN"]} />
                        }
                    >
                        <Route
                            path="/demandes"
                            element={
                                <Layout>
                                    <Demandes />
                                </Layout>
                            }
                        />
                    </Route>

                    {/* La page racine redirige vers le tableau de bord. */}
                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/dashboard"
                                replace
                            />
                        }
                    />

                </Route>

                {/* Toute adresse inconnue redirige vers la connexion. */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;