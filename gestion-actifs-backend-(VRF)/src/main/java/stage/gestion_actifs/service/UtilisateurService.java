package stage.gestion_actifs.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import stage.gestion_actifs.Repository.UtilisateurRepository;
import stage.gestion_actifs.entity.Utilisateur;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UtilisateurService {

    // Seuls ces rôles sont reconnus par la sécurité de l'application
    // (SecurityConfig, JwtAuthenticationFilter). "Informaticien",
    // "Responsable", etc. sont des intitulés de poste (champ "poste"),
    // pas des rôles.
    private static final Set<String> ROLES_VALIDES =
            Set.of("ADMIN", "TECHNICIEN", "UTILISATEUR");

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(
            UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder) {

        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Cette méthode récupère tous les utilisateurs.
    public List<Utilisateur> findAll() {
        return utilisateurRepository.findAll();
    }

    // Cette méthode récupère un utilisateur par son identifiant.
    public Optional<Utilisateur> findById(Long id) {
        return utilisateurRepository.findById(id);
    }

    // Cette méthode ajoute ou modifie un utilisateur.
    public Utilisateur save(Utilisateur utilisateur) {

        // Le rôle est normalisé et vérifié : seuls ADMIN, TECHNICIEN
        // et UTILISATEUR donnent accès à l'application.
        String role =
                utilisateur.getRole() == null
                        ? ""
                        : utilisateur.getRole().trim().toUpperCase();

        if (!ROLES_VALIDES.contains(role)) {

            throw new IllegalArgumentException(
                    "Rôle invalide : \"" + utilisateur.getRole()
                            + "\". Rôles autorisés : ADMIN, TECHNICIEN, UTILISATEUR."
            );
        }

        utilisateur.setRole(role);

        // Cette partie traite la modification d'un utilisateur existant.
        if (utilisateur.getId() != null) {

            Optional<Utilisateur> existant =
                    utilisateurRepository.findById(utilisateur.getId());

            if (existant.isPresent()) {

                String ancienMotDePasse =
                        existant.get().getMotDePasse();

                // Si aucun nouveau mot de passe n'est fourni,
                // on conserve l'ancien mot de passe.
                if (utilisateur.getMotDePasse() == null
                        || utilisateur.getMotDePasse().isBlank()) {

                    utilisateur.setMotDePasse(ancienMotDePasse);

                } else {

                    // Si un nouveau mot de passe est fourni,
                    // il est chiffré avant l'enregistrement.
                    utilisateur.setMotDePasse(
                            passwordEncoder.encode(
                                    utilisateur.getMotDePasse()
                            )
                    );
                }
            }

        } else {

            // Cette partie traite la création d'un nouvel utilisateur.
            if (utilisateur.getMotDePasse() != null
                    && !utilisateur.getMotDePasse().isBlank()) {

                utilisateur.setMotDePasse(
                        passwordEncoder.encode(
                                utilisateur.getMotDePasse()
                        )
                );
            }
        }

        return utilisateurRepository.save(utilisateur);
    }

    // Cette méthode supprime un utilisateur.
    public void deleteById(Long id) {
        utilisateurRepository.deleteById(id);
    }
}