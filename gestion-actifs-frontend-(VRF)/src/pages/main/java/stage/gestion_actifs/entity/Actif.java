package stage.gestion_actifs.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "actif")
public class Actif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de l'actif est obligatoire")
    private String nom;

    @NotBlank(message = "Le type de l'actif est obligatoire")
    private String type;

    @NotBlank(message = "La marque est obligatoire")
    private String marque;

    @NotBlank(message = "Le modèle est obligatoire")
    private String modele;

    @NotBlank(message = "Le numéro de série est obligatoire")
    private String numeroSerie;

    @NotNull(message = "La date d'achat est obligatoire")
    private LocalDate dateAchat;

    @NotBlank(message = "Le statut est obligatoire")
    private String statut;

    @NotNull(message = "La date de fin de garantie est obligatoire")
    private LocalDate dateFinGarantie;

    @NotNull(message = "La catégorie est obligatoire")
    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    public Actif() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getMarque() {
        return marque;
    }

    public void setMarque(String marque) {
        this.marque = marque;
    }

    public String getModele() {
        return modele;
    }

    public void setModele(String modele) {
        this.modele = modele;
    }

    public String getNumeroSerie() {
        return numeroSerie;
    }

    public void setNumeroSerie(String numeroSerie) {
        this.numeroSerie = numeroSerie;
    }

    public LocalDate getDateAchat() {
        return dateAchat;
    }

    public void setDateAchat(LocalDate dateAchat) {
        this.dateAchat = dateAchat;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public LocalDate getDateFinGarantie() {
        return dateFinGarantie;
    }

    public void setDateFinGarantie(LocalDate dateFinGarantie) {
        this.dateFinGarantie = dateFinGarantie;
    }

    public Categorie getCategorie() {
        return categorie;
    }

    public void setCategorie(Categorie categorie) {
        this.categorie = categorie;
    }
}