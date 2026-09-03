package stage.gestion_actifs.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stage.gestion_actifs.entity.Maintenance;

public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {
}
