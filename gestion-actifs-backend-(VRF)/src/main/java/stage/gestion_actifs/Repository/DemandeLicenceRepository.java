package stage.gestion_actifs.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import stage.gestion_actifs.entity.DemandeLicence;

import java.util.List;

@Repository
public interface DemandeLicenceRepository
        extends JpaRepository<DemandeLicence, Long> {

    // Cette méthode récupère les demandes de licence d'un utilisateur.
    List<DemandeLicence> findByUtilisateurEmail(String email);
}
