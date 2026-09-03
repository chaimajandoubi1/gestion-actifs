package stage.gestion_actifs.service;

import org.springframework.stereotype.Service;

import stage.gestion_actifs.Repository.CategorieRepository;
import stage.gestion_actifs.Repository.DemandeActifRepository;
import stage.gestion_actifs.Repository.UtilisateurRepository;
import stage.gestion_actifs.dto.DemandeActifRequest;
import stage.gestion_actifs.dto.TraitementRequest;
import stage.gestion_actifs.entity.Categorie;
import stage.gestion_actifs.entity.DemandeActif;
import stage.gestion_actifs.entity.Utilisateur;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class DemandeActifService {

    private final DemandeActifRepository demandeActifRepository;
    private final CategorieRepository categorieRepository;
    private final UtilisateurRepository utilisateurRepository;

    public DemandeActifService(
            DemandeActifRepository demandeActifRepository,
            CategorieRepository categorieRepository,
            UtilisateurRepository utilisateurRepository) {

        this.demandeActifRepository = demandeActifRepository;
        this.categorieRepository = categorieRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // Cette méthode récupère toutes les demandes d'actif.
    public List<DemandeActif> findAll() {
        return demandeActifRepository.findAll();
    }

    // Cette méthode récupère les demandes d'actif d'un utilisateur.
    public List<DemandeActif> findByUtilisateurEmail(String email) {
        return demandeActifRepository.findByUtilisateurEmail(email);
    }

    // Cette méthode récupère une demande d'actif par son identifiant.
    public Optional<DemandeActif> findById(Long id) {
        return demandeActifRepository.findById(id);
    }

    // Cette méthode crée une nouvelle demande d'actif.
    public DemandeActif creer(
            DemandeActifRequest requete,
            String emailUtilisateur) {

        Utilisateur utilisateur = utilisateurRepository
                .findByEmail(emailUtilisateur)
                .orElseThrow(() ->
                        new NoSuchElementException("Utilisateur introuvable"));

        Categorie categorie = null;

        if (requete.getCategorieId() != null) {
            categorie = categorieRepository
                    .findById(requete.getCategorieId())
                    .orElseThrow(() ->
                            new NoSuchElementException("Catégorie introuvable"));
        }

        DemandeActif demande = new DemandeActif();
        demande.setUtilisateur(utilisateur);
        demande.setCategorie(categorie);
        demande.setDescription(requete.getDescription());
        demande.setStatut("EN_ATTENTE");
        demande.setDateCreation(LocalDateTime.now());

        return demandeActifRepository.save(demande);
    }

    // Cette méthode permet à l'administrateur / au technicien de traiter une demande.
    public DemandeActif traiter(
            Long id,
            TraitementRequest requete,
            String emailTraitant) {

        DemandeActif demande = demandeActifRepository
                .findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException("Demande introuvable"));

        Utilisateur traitant = utilisateurRepository
                .findByEmail(emailTraitant)
                .orElse(null);

        demande.setStatut(requete.getStatut());
        demande.setCommentaireTraitement(requete.getCommentaire());
        demande.setTraitePar(traitant);

        return demandeActifRepository.save(demande);
    }

    // Cette méthode supprime une demande d'actif.
    public void deleteById(Long id) {
        demandeActifRepository.deleteById(id);
    }
}
