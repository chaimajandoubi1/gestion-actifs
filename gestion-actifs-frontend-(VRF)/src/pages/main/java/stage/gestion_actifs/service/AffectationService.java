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

    // =====================================================
    // TOUTES LES AFFECTATIONS
    // ADMIN
    // =====================================================

    public List<Affectation> findAll() {
        return affectationRepository.findAll();
    }

    // =====================================================
    // AFFECTATIONS D'UN UTILISATEUR
    // =====================================================

    public List<Affectation> findByUtilisateurEmail(
            String email) {

        return affectationRepository
                .findByUtilisateurEmail(email);
    }

    // =====================================================
    // AFFECTATIONS ACTIVES D'UN UTILISATEUR
    // =====================================================

    public List<Affectation> findAffectationsActivesByUtilisateurEmail(
            String email) {

        return affectationRepository
                .findByUtilisateurEmailAndDateFinIsNull(email);
    }

    // =====================================================
    // ACTIFS ACTUELLEMENT AFFECTÉS À UN UTILISATEUR
    // =====================================================

    public List<Actif> findActifsByUtilisateurEmail(
            String email) {

        return affectationRepository
                .findByUtilisateurEmailAndDateFinIsNull(email)
                .stream()
                .map(Affectation::getActif)
                .filter(actif -> actif != null)
                .collect(Collectors.toList());
    }

    // =====================================================
    // AFFECTATION PAR ID
    // =====================================================

    public Optional<Affectation> findById(Long id) {
        return affectationRepository.findById(id);
    }

    // =====================================================
    // AJOUTER / MODIFIER
    // ADMIN
    // =====================================================

    public Affectation save(Affectation affectation) {
        return affectationRepository.save(affectation);
    }

    // =====================================================
    // SUPPRIMER
    // ADMIN
    // =====================================================

    public void deleteById(Long id) {
        affectationRepository.deleteById(id);
    }
}