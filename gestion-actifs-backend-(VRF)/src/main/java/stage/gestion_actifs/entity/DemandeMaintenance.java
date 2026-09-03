
        package stage.gestion_actifs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "demande_maintenance")
public class DemandeMaintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "L'actif est obligatoire")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "actif_id", nullable = false)
    private Actif actif;

    @NotNull(message = "L'utilisateur est obligatoire")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @NotBlank(message = "La description du problème est obligatoire")
    @Column(length = 2000, nullable = false)
    private String description;

    // EN_ATTENTE, EN_COURS, TRAITEE, REJETEE
    @Column(nullable = false)
    private String statut = "EN_ATTENTE";

    // Date à laquelle l'utilisateur a créé la demande
    @Column(name = "date_demande", nullable = false)
    private LocalDateTime dateDemande;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation;

    @Column(name = "commentaire_traitement", length = 2000)
    private String commentaireTraitement;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "traite_par_id")
    private Utilisateur traitePar;

    public DemandeMaintenance() {
    }

    @PrePersist
    protected void onCreate() {
        if (dateDemande == null) {
            dateDemande = LocalDateTime.now();
        }

        if (dateCreation == null) {
            dateCreation = LocalDateTime.now();
        }

        if (statut == null) {
            statut = "EN_ATTENTE";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Actif getActif() {
        return actif;
    }

    public void setActif(Actif actif) {
        this.actif = actif;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public LocalDateTime getDateDemande() {
        return dateDemande;
    }

    public void setDateDemande(LocalDateTime dateDemande) {
        this.dateDemande = dateDemande;
    }

    public LocalDateTime getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getCommentaireTraitement() {
        return commentaireTraitement;
    }

    public void setCommentaireTraitement(String commentaireTraitement) {
        this.commentaireTraitement = commentaireTraitement;
    }

    public Utilisateur getTraitePar() {
        return traitePar;
    }

    public void setTraitePar(Utilisateur traitePar) {
        this.traitePar = traitePar;
    }
}

