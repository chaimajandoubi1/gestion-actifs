package stage.gestion_actifs.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import stage.gestion_actifs.entity.Categorie;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {
}
