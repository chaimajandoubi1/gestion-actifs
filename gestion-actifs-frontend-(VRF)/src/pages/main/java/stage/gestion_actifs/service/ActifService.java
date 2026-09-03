package stage.gestion_actifs.service;

import org.springframework.stereotype.Service;

import stage.gestion_actifs.Repository.ActifRepository;
import stage.gestion_actifs.Repository.AffectationRepository;
import stage.gestion_actifs.entity.Actif;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ActifService {

    private final ActifRepository actifRepository;
    private final AffectationRepository affectationRepository;

    public ActifService(
            ActifRepository actifRepository,
            AffectationRepository affectationRepository) {

        this.actifRepository = actifRepository;
        this.affectationRepository = affectationRepository;
    }

    // =====================================================
    // TOUS LES ACTIFS
    // =====================================================

    public List<Actif> findAll() {
        return actifRepository.findAll();
    }

    // =====================================================
    // ACTIF PAR ID
    // =====================================================

    public Optional<Actif> findById(Long id) {
        return actifRepository.findById(id);
    }

    // =====================================================
    // AJOUTER / MODIFIER UN ACTIF
    // =====================================================

    public Actif save(Actif actif) {
        return actifRepository.save(actif);
    }

    // =====================================================
    // SUPPRIMER UN ACTIF
    // =====================================================

    public void deleteById(Long id) {
        actifRepository.deleteById(id);
    }

    // =====================================================
    // ACTIFS AFFECTÉS À UN UTILISATEUR
    // =====================================================

    public List<Actif> findActifsByUtilisateurEmail(
            String email) {

        return affectationRepository
                .findByUtilisateurEmailAndDateFinIsNull(email)
                .stream()
                .map(affectation -> affectation.getActif())
                .filter(actif -> actif != null)
                .collect(Collectors.toList());
    }

    // =====================================================
    // ACTIFS D'UN UTILISATEUR PAR CATÉGORIE
    // =====================================================

    public List<Actif> findActifsByUtilisateurEmailAndCategorie(
            String email,
            Long categorieId) {

        return affectationRepository
                .findByUtilisateurEmailAndDateFinIsNull(email)
                .stream()
                .map(affectation -> affectation.getActif())
                .filter(actif -> actif != null)
                .filter(actif ->
                        actif.getCategorie() != null
                                && actif.getCategorie().getId()
                                .equals(categorieId)
                )
                .collect(Collectors.toList());
    }
}