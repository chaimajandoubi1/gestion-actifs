package stage.gestion_actifs.dto;

import jakarta.validation.constraints.NotNull;

// DTO utilisé par l'utilisateur pour demander l'accès à une licence.
public class DemandeLicenceRequest {

    @NotNull(message = "La licence est obligatoire")
    private Long licenceId;

    private String description;

    public DemandeLicenceRequest() {
    }

    public Long getLicenceId() {
        return licenceId;
    }

    public void setLicenceId(Long licenceId) {
        this.licenceId = licenceId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
