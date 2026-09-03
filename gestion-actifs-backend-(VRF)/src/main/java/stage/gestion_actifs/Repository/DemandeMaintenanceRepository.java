package stage.gestion_actifs.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import stage.gestion_actifs.entity.DemandeMaintenance;

import java.util.List;

@Repository
public interface DemandeMaintenanceRepository
        extends JpaRepository<DemandeMaintenance, Long> {

    // Cette méthode récupère les demandes de maintenance d'un utilisateur.
    List<DemandeMaintenance> findByUtilisateurEmail(String email);
}
