package stage.gestion_actifs.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String motDePasse;

    @Column(nullable = false)
    private String role;

    // Ces deux champs sont purement informatifs (affichage) et n'ont
    // aucun impact sur les droits d'accès, qui dépendent uniquement
    // du champ "role" (ADMIN, TECHNICIEN ou UTILISATEUR).
    private String service;

    // Intitulé de poste (ex : Informaticien, Responsable, Comptable...).
    private String poste;

    @JsonIgnore
    @OneToMany(
            mappedBy = "utilisateur",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Affectation> affectations = new ArrayList<>();

    public Utilisateur() {
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getPoste() {
        return poste;
    }

    public void setPoste(String poste) {
        this.poste = poste;
    }

    public List<Affectation> getAffectations() {
        return affectations;
    }

    public void setAffectations(List<Affectation> affectations) {
        this.affectations = affectations;
    }
}