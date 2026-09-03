package stage.gestion_actifs.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "actif")
public class Actif {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    private String type;

    private String marque;

    private String modele;

    @Column(name = "numero_serie")
    private String numeroSerie;

    @Column(name = "date_achat")
    private LocalDate dateAchat;

    private String statut;

    @Column(name = "date_fin_garantie")
    private LocalDate dateFinGarantie;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;

    @JsonIgnore
    @OneToMany(
            mappedBy = "actif",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Affectation> affectations = new ArrayList<>();

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

    public List<Affectation> getAffectations() {
        return affectations;
    }

    public void setAffectations(List<Affectation> affectations) {
        this.affectations = affectations;
    }
}