package stage.gestion_actifs.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import stage.gestion_actifs.entity.DemandeActif;

import java.util.List;

@Repository
public interface DemandeActifRepository
        extends JpaRepository<DemandeActif, Long> {

    // Cette méthode récupère les demandes d'actif d'un utilisateur.
    List<DemandeActif> findByUtilisateurEmail(String email);
}
