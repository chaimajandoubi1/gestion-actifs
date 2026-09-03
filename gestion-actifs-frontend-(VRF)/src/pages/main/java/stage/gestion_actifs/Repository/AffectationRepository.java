package stage.gestion_actifs.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import stage.gestion_actifs.entity.Affectation;

import java.util.List;

@Repository
public interface AffectationRepository
        extends JpaRepository<Affectation, Long> {

    // Toutes les affectations d'un utilisateur
    List<Affectation> findByUtilisateurEmail(String email);

    // Seulement les affectations actives
    List<Affectation> findByUtilisateurEmailAndDateFinIsNull(
            String email
    );
}