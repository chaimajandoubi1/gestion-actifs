package stage.gestion_actifs.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import stage.gestion_actifs.entity.Actif;

@Repository
public interface ActifRepository
        extends JpaRepository<Actif, Long> {
}