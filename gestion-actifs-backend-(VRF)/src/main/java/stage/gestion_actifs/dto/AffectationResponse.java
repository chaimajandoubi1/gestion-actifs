package stage.gestion_actifs.dto;

import java.time.LocalDate;

public class AffectationResponse {

    private Long id;

    // Informations de l'actif
    private Long actifId;
    private String actifNom;
    private String actifMarque;
    private String actifModele;
    private String actifNumeroSerie;

    // Informations de l'utilisateur
    private Long utilisateurId;
    private String utilisateurNom;
    private String utilisateurEmail;

    // Dates
    private LocalDate dateDebut;
    private LocalDate dateFin;

    public AffectationResponse() {
    }

    public AffectationResponse(
            Long id,
            Long actifId,
            String actifNom,
            String actifMarque,
            String actifModele,
            String actifNumeroSerie,
            Long utilisateurId,
            String utilisateurNom,
            String utilisateurEmail,
            LocalDate dateDebut,
            LocalDate dateFin) {

        this.id = id;

        this.actifId = actifId;
        this.actifNom = actifNom;
        this.actifMarque = actifMarque;
        this.actifModele = actifModele;
        this.actifNumeroSerie = actifNumeroSerie;

        this.utilisateurId = utilisateurId;
        this.utilisateurNom = utilisateurNom;
        this.utilisateurEmail = utilisateurEmail;

        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getActifId() {
        return actifId;
    }

    public void setActifId(Long actifId) {
        this.actifId = actifId;
    }

    public String getActifNom() {
        return actifNom;
    }

    public void setActifNom(String actifNom) {
        this.actifNom = actifNom;
    }

    public String getActifMarque() {
        return actifMarque;
    }

    public void setActifMarque(String actifMarque) {
        this.actifMarque = actifMarque;
    }

    public String getActifModele() {
        return actifModele;
    }

    public void setActifModele(String actifModele) {
        this.actifModele = actifModele;
    }

    public String getActifNumeroSerie() {
        return actifNumeroSerie;
    }

    public void setActifNumeroSerie(String actifNumeroSerie) {
        this.actifNumeroSerie = actifNumeroSerie;
    }

    public Long getUtilisateurId() {
        return utilisateurId;
    }

    public void setUtilisateurId(Long utilisateurId) {
        this.utilisateurId = utilisateurId;
    }

    public String getUtilisateurNom() {
        return utilisateurNom;
    }

    public void setUtilisateurNom(String utilisateurNom) {
        this.utilisateurNom = utilisateurNom;
    }

    public String getUtilisateurEmail() {
        return utilisateurEmail;
    }

    public void setUtilisateurEmail(String utilisateurEmail) {
        this.utilisateurEmail = utilisateurEmail;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFin() {
        return dateFin;
    }

    public void setDateFin(LocalDate dateFin) {
        this.dateFin = dateFin;
    }
}