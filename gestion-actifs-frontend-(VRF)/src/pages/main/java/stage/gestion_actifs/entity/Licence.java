package stage.gestion_actifs.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "licence")
public class Licence {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom de la licence est obligatoire")
    private String nom;

    @NotBlank(message = "L'éditeur est obligatoire")
    private String editeur;

    @NotNull(message = "La date d'expiration est obligatoire")
    private LocalDate dateExpiration;

    @NotNull(message = "Le nombre de postes est obligatoire")
    @Min(value = 1, message = "Le nombre de postes doit être supérieur à 0")
    private Integer nbPostes;

    public Licence() {
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

    public String getEditeur() {
        return editeur;
    }

    public void setEditeur(String editeur) {
        this.editeur = editeur;
    }

    public LocalDate getDateExpiration() {
        return dateExpiration;
    }

    public void setDateExpiration(LocalDate dateExpiration) {
        this.dateExpiration = dateExpiration;
    }

    public Integer getNbPostes() {
        return nbPostes;
    }

    public void setNbPostes(Integer nbPostes) {
        this.nbPostes = nbPostes;
    }
}