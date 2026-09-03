package stage.gestion_actifs.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import stage.gestion_actifs.entity.Affectation;

import java.util.List;

@Repository
public interface AffectationRepository
        extends JpaRepository<Affectation, Long> {

    // Cette méthode récupère les affectations d'un utilisateur grâce à son email.
    List<Affectation> findByUtilisateurEmail(String email);

    // Cette méthode récupère uniquement les affectations encore actives
    // (sans date de fin renseignée). Conservée pour compatibilité, mais
    // findAffectationsActivesByUtilisateurEmail ci-dessous doit être
    // préférée : une affectation avec une dateFin future est elle aussi
    // active, ce que cette méthode ne détectait pas.
    List<Affectation> findByUtilisateurEmailAndDateFinIsNull(
            String email
    );

    // Cette méthode récupère les affectations "actuellement actives" d'un
    // utilisateur : soit sans date de fin, soit avec une date de fin qui
    // n'est pas encore passée. Utilisée pour "Mes actifs" (espace
    // utilisateur), afin qu'elle reste cohérente avec "Mes affectations".
    @Query(
        "SELECT a FROM Affectation a " +
        "WHERE a.utilisateur.email = :email " +
        "AND (a.dateFin IS NULL OR a.dateFin >= CURRENT_DATE)"
    )
    List<Affectation> findAffectationsActivesByUtilisateurEmail(
            @Param("email") String email
    );
}