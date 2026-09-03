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

    // Cette méthode récupère toutes les licences.
    public List<Licence> findAll() {
        return licenceRepository.findAll();
    }

    // Cette méthode récupère une licence par son identifiant.
    public Optional<Licence> findById(Long id) {
        return licenceRepository.findById(id);
    }

    // Cette méthode ajoute ou modifie une licence.
    public Licence save(Licence licence) {
        return licenceRepository.save(licence);
    }

    // Cette méthode supprime une licence.
    public void deleteById(Long id) {
        licenceRepository.deleteById(id);
    }
}