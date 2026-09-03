package stage.gestion_actifs.service;

import org.springframework.stereotype.Service;

import stage.gestion_actifs.Repository.DemandeLicenceRepository;
import stage.gestion_actifs.Repository.LicenceRepository;
import stage.gestion_actifs.Repository.UtilisateurRepository;
import stage.gestion_actifs.dto.DemandeLicenceRequest;
import stage.gestion_actifs.dto.TraitementRequest;
import stage.gestion_actifs.entity.DemandeLicence;
import stage.gestion_actifs.entity.Licence;
import stage.gestion_actifs.entity.Utilisateur;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class DemandeLicenceService {

    private final DemandeLicenceRepository demandeLicenceRepository;
    private final LicenceRepository licenceRepository;
    private final UtilisateurRepository utilisateurRepository;

    public DemandeLicenceService(
            DemandeLicenceRepository demandeLicenceRepository,
            LicenceRepository licenceRepository,
            UtilisateurRepository utilisateurRepository) {

        this.demandeLicenceRepository = demandeLicenceRepository;
        this.licenceRepository = licenceRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    // Cette méthode récupère toutes les demandes de licence.
    public List<DemandeLicence> findAll() {
        return demandeLicenceRepository.findAll();
    }

    // Cette méthode récupère les demandes de licence d'un utilisateur.
    public List<DemandeLicence> findByUtilisateurEmail(String email) {
        return demandeLicenceRepository.findByUtilisateurEmail(email);
    }

    // Cette méthode récupère une demande de licence par son identifiant.
    public Optional<DemandeLicence> findById(Long id) {
        return demandeLicenceRepository.findById(id);
    }

    // Cette méthode crée une nouvelle demande de licence.
    public DemandeLicence creer(
            DemandeLicenceRequest requete,
            String emailUtilisateur) {

        Utilisateur utilisateur = utilisateurRepository
                .findByEmail(emailUtilisateur)
                .orElseThrow(() ->
                        new NoSuchElementException("Utilisateur introuvable"));

        Licence licence = licenceRepository
                .findById(requete.getLicenceId())
                .orElseThrow(() ->
                        new NoSuchElementException("Licence introuvable"));

        DemandeLicence demande = new DemandeLicence();
        demande.setUtilisateur(utilisateur);
        demande.setLicence(licence);
        demande.setDescription(requete.getDescription());
        demande.setStatut("EN_ATTENTE");
        demande.setDateCreation(LocalDateTime.now());

        return demandeLicenceRepository.save(demande);
    }

    // Cette méthode permet à l'administrateur / au technicien de traiter une demande.
    public DemandeLicence traiter(
            Long id,
            TraitementRequest requete,
            String emailTraitant) {

        DemandeLicence demande = demandeLicenceRepository
                .findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException("Demande introuvable"));

        Utilisateur traitant = utilisateurRepository
                .findByEmail(emailTraitant)
                .orElse(null);

        demande.setStatut(requete.getStatut());
        demande.setCommentaireTraitement(requete.getCommentaire());
        demande.setTraitePar(traitant);

        return demandeLicenceRepository.save(demande);
    }

    // Cette méthode supprime une demande de licence.
    public void deleteById(Long id) {
        demandeLicenceRepository.deleteById(id);
    }
}
