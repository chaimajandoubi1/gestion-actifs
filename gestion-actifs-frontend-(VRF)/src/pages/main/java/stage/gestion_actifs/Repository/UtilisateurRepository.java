package stage.gestion_actifs.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import stage.gestion_actifs.entity.Utilisateur;

import java.util.Optional;

public interface UtilisateurRepository
        extends JpaRepository<Utilisateur, Long> {

    Optional<Utilisateur> findByEmail(String email);
}