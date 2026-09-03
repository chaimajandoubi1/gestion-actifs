package stage.gestion_actifs.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import stage.gestion_actifs.Repository.UtilisateurRepository;
import stage.gestion_actifs.entity.Utilisateur;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public UtilisateurService(
            UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder) {

        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Utilisateur> findAll() {
        return utilisateurRepository.findAll();
    }

    public Optional<Utilisateur> findById(Long id) {
        return utilisateurRepository.findById(id);
    }

    public Utilisateur save(Utilisateur utilisateur) {

        // =========================
        // MODIFICATION
        // =========================

        if (utilisateur.getId() != null) {

            Optional<Utilisateur> existant =
                    utilisateurRepository.findById(
                            utilisateur.getId()
                    );

            if (existant.isPresent()) {

                String ancienMotDePasse =
                        existant.get().getMotDePasse();

                // Aucun nouveau mot de passe
                if (utilisateur.getMotDePasse() == null
                        || utilisateur.getMotDePasse().isBlank()) {

                    utilisateur.setMotDePasse(
                            ancienMotDePasse
                    );

                } else {

                    // Nouveau mot de passe
                    utilisateur.setMotDePasse(
                            passwordEncoder.encode(
                                    utilisateur.getMotDePasse()
                            )
                    );
                }
            }

        }

        // =========================
        // CREATION
        // =========================

        else {

            if (utilisateur.getMotDePasse() != null
                    && !utilisateur.getMotDePasse().isBlank()) {

                utilisateur.setMotDePasse(
                        passwordEncoder.encode(
                                utilisateur.getMotDePasse()
                        )
                );
            }
        }

        return utilisateurRepository.save(
                utilisateur
        );
    }

    public void deleteById(Long id) {
        utilisateurRepository.deleteById(id);
    }
}