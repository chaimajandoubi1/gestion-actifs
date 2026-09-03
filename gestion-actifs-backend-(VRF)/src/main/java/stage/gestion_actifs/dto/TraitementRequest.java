package stage.gestion_actifs.dto;

import jakarta.validation.constraints.NotBlank;

// DTO générique utilisé par l'administrateur / le technicien pour traiter
// une demande (maintenance, actif ou licence).
public class TraitementRequest {

    @NotBlank(message = "Le statut est obligatoire")
    private String statut;

    private String commentaire;

    public TraitementRequest() {
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }
}
