package stage.gestion_actifs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "demande_licence")
public class DemandeLicence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "L'utilisateur est obligatoire")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @NotNull(message = "La licence est obligatoire")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "licence_id", nullable = false)
    private Licence licence;

    @Column(length = 2000)
    private String description;

    // EN_ATTENTE, EN_COURS, TRAITEE, REJETEE
    @Column(nullable = false)
    private String statut = "EN_ATTENTE";

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "commentaire_traitement", length = 2000)
    private String commentaireTraitement;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "traite_par_id")
    private Utilisateur traitePar;

    public DemandeLicence() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Utilisateur getUtilisateur() {
        return utilisateur;
    }

    public void setUtilisateur(Utilisateur utilisateur) {
        this.utilisateur = utilisateur;
    }

    public Licence getLicence() {
        return licence;
    }

    public void setLicence(Licence licence) {
        this.licence = licence;
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
