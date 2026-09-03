package stage.gestion_actifs.dto;

import jakarta.validation.constraints.NotBlank;

// DTO utilisé par l'utilisateur pour demander un nouvel actif.
public class DemandeActifRequest {

    // La catégorie est facultative (l'utilisateur peut ne pas savoir laquelle choisir).
    private Long categorieId;

    @NotBlank(message = "La description de la demande est obligatoire")
    private String description;

    public DemandeActifRequest() {
    }

    public Long getCategorieId() {
        return categorieId;
    }

    public void setCategorieId(Long categorieId) {
        this.categorieId = categorieId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
