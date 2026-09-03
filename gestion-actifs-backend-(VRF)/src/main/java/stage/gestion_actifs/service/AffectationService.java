package stage.gestion_actifs.service;

import org.springframework.stereotype.Service;

import stage.gestion_actifs.Repository.AffectationRepository;
import stage.gestion_actifs.entity.Affectation;
import stage.gestion_actifs.entity.Actif;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AffectationService {

    private final AffectationRepository affectationRepository;

    public AffectationService(
            AffectationRepository affectationRepository) {

        this.affectationRepository = affectationRepository;
    }

    // Cette méthode récupère toutes les affectations.
    public List<Affectation> findAll() {
        return affectationRepository.findAll();
    }

    // Cette méthode récupère les affectations d'un utilisateur.
    public List<Affectation> findByUtilisateurEmail(String email) {

        return affectationRepository
                .findByUtilisateurEmail(email);
    }

    // Cette méthode récupère uniquement les affectations actives.
    public List<Affectation> findAffectationsActivesByUtilisateurEmail(
            String email) {

        return affectationRepository
                .findByUtilisateurEmailAndDateFinIsNull(email);
    }

    // Cette méthode récupère les actifs actuellement affectés à un utilisateur.
    public List<Actif> findActifsByUtilisateurEmail(String email) {

        return affectationRepository
                .findByUtilisateurEmailAndDateFinIsNull(email)
                .stream()
                .map(Affectation::getActif)
                .filter(actif -> actif != null)
                .collect(Collectors.toList());
    }

    // Cette méthode récupère une affectation par son identifiant.
    public Optional<Affectation> findById(Long id) {
        return affectationRepository.findById(id);
    }

    // Cette méthode ajoute ou modifie une affectation.
    public Affectation save(Affectation affectation) {
        return affectationRepository.save(affectation);
    }

    // Cette méthode supprime une affectation.
    public void deleteById(Long id) {
        affectationRepository.deleteById(id);
    }
}