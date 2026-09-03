package stage.gestion_actifs.service;

import org.springframework.stereotype.Service;

import stage.gestion_actifs.Repository.ActifRepository;
import stage.gestion_actifs.Repository.DemandeMaintenanceRepository;
import stage.gestion_actifs.Repository.UtilisateurRepository;
import stage.gestion_actifs.dto.DemandeMaintenanceRequest;
import stage.gestion_actifs.dto.TraitementRequest;
import stage.gestion_actifs.entity.Actif;
import stage.gestion_actifs.entity.DemandeMaintenance;
import stage.gestion_actifs.entity.Utilisateur;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class DemandeMaintenanceService {

    private final DemandeMaintenanceRepository demandeMaintenanceRepository;
    private final ActifRepository actifRepository;
    private final UtilisateurRepository utilisateurRepository;

    public DemandeMaintenanceService(
            DemandeMaintenanceRepository demandeMaintenanceRepository,
            ActifRepository actifRepository,
            UtilisateurRepository utilisateurRepository) {

        this.demandeMaintenanceRepository = demandeMaintenanceRepository;
        this.actifRepository = actifRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // Cette méthode récupère toutes les demandes de maintenance.
    public List<DemandeMaintenance> findAll() {
        return demandeMaintenanceRepository.findAll();
    }

    // Cette méthode récupère les demandes de maintenance d'un utilisateur.
    public List<DemandeMaintenance> findByUtilisateurEmail(String email) {
        return demandeMaintenanceRepository.findByUtilisateurEmail(email);
    }

    // Cette méthode récupère une demande de maintenance par son identifiant.
    public Optional<DemandeMaintenance> findById(Long id) {
        return demandeMaintenanceRepository.findById(id);
    }

    // Cette méthode crée une nouvelle demande de maintenance (signalement de problème).
    public DemandeMaintenance creer(
            DemandeMaintenanceRequest requete,
            String emailUtilisateur) {

        Actif actif = actifRepository
                .findById(requete.getActifId())
                .orElseThrow(() ->
                        new NoSuchElementException("Actif introuvable"));

        Utilisateur utilisateur = utilisateurRepository
                .findByEmail(emailUtilisateur)
                .orElseThrow(() ->
                        new NoSuchElementException("Utilisateur introuvable"));

        DemandeMaintenance demande = new DemandeMaintenance();
        demande.setActif(actif);
        demande.setUtilisateur(utilisateur);
        demande.setDescription(requete.getDescription());
        demande.setStatut("EN_ATTENTE");
        demande.setDateCreation(LocalDateTime.now());

        return demandeMaintenanceRepository.save(demande);
    }

    // Cette méthode permet à l'administrateur / au technicien de traiter une demande.
    public DemandeMaintenance traiter(
            Long id,
            TraitementRequest requete,
            String emailTraitant) {

        DemandeMaintenance demande = demandeMaintenanceRepository
                .findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException("Demande introuvable"));

        Utilisateur traitant = utilisateurRepository
                .findByEmail(emailTraitant)
                .orElse(null);

        demande.setStatut(requete.getStatut());
        demande.setCommentaireTraitement(requete.getCommentaire());
        demande.setTraitePar(traitant);

        return demandeMaintenanceRepository.save(demande);
    }

    // Cette méthode supprime une demande de maintenance.
    public void deleteById(Long id) {
        demandeMaintenanceRepository.deleteById(id);
    }
}
