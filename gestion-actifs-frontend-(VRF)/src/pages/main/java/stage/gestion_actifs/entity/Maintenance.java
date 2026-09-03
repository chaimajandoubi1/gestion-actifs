package stage.gestion_actifs.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Entity
@Table(name = "maintenance")
public class Maintenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "L'actif est obligatoire")
    @ManyToOne
    @JoinColumn(name = "actif_id")
    private Actif actif;

    @NotBlank(message = "Le type de maintenance est obligatoire")
    private String type;

    @NotNull(message = "La date de maintenance est obligatoire")
    private LocalDate date;

    @NotBlank(message = "La description est obligatoire")
    private String description;

    @NotNull(message = "Le coût est obligatoire")
    @DecimalMin(value = "0.0", inclusive = true, message = "Le coût doit être positif")
    private Double cout;

    public Maintenance() {
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getCout() {
        return cout;
    }

    public void setCout(Double cout) {
        this.cout = cout;
    }
}