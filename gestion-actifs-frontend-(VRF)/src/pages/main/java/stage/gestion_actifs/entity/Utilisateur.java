package stage.gestion_actifs.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "utilisateur")
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom est obligatoire")
    @Column(nullable = false)
    private String nom;

    @NotBlank(message = "L'email est obligatoire")
    @Email(message = "L'adresse email n'est pas valide")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Le rôle est obligatoire")
    @Column(nullable = false)
    private String role;

    @NotBlank(message = "Le service est obligatoire")
    @Column(nullable = false)
    private String service;

    @NotBlank(message = "Le mot de passe est obligatoire")
    @Size(
            min = 6,
            message = "Le mot de passe doit contenir au moins 6 caractères"
    )
    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

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

    public String getMotDePasse() {
        return motDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        this.motDePasse = motDePasse;
    }
}