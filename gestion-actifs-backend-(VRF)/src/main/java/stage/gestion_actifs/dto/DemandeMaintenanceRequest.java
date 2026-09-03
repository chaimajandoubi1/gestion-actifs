package stage.gestion_actifs.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// DTO utilisé par l'utilisateur pour signaler un problème sur un actif.
public class DemandeMaintenanceRequest {

    @NotNull(message = "L'actif est obligatoire")
    private Long actifId;

    @NotBlank(message = "La description du problème est obligatoire")
    private String description;

    public DemandeMaintenanceRequest() {
    }

    public Long getActifId() {
        return actifId;
    }

    public void setActifId(Long actifId) {
        this.actifId = actifId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
