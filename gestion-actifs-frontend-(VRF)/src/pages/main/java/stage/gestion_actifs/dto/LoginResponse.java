package stage.gestion_actifs.dto;

public class LoginResponse {

    private Long id;
    private String token;
    private String nom;
    private String email;
    private String role;

    public LoginResponse() {
    }

    public LoginResponse(
            Long id,
            String token,
            String nom,
            String email,
            String role) {

        this.id = id;
        this.token = token;
        this.nom = nom;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
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
}