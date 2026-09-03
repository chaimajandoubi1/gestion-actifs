package stage.gestion_actifs.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stage.gestion_actifs.entity.Licence;

public interface LicenceRepository extends JpaRepository<Licence, Long> {
}
