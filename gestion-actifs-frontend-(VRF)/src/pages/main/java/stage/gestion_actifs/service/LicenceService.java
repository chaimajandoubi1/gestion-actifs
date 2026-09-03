package stage.gestion_actifs.service;

import org.springframework.stereotype.Service;
import stage.gestion_actifs.Repository.LicenceRepository;
import stage.gestion_actifs.entity.Licence;

import java.util.List;
import java.util.Optional;

@Service
public class LicenceService {

    private final LicenceRepository licenceRepository;

    public LicenceService(LicenceRepository licenceRepository) {
        this.licenceRepository = licenceRepository;
    }

    public List<Licence> findAll() {
        return licenceRepository.findAll();
    }

    public Optional<Licence> findById(Long id) {
        return licenceRepository.findById(id);
    }

    public Licence save(Licence licence) {
        return licenceRepository.save(licence);
    }

    public void deleteById(Long id) {
        licenceRepository.deleteById(id);
    }
}
