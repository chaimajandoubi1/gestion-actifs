package stage.gestion_actifs.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import stage.gestion_actifs.entity.Utilisateur;
import stage.gestion_actifs.service.UtilisateurService;

import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = "http://localhost:5173")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    // Récupérer tous les utilisateurs
    @GetMapping
    public List<Utilisateur> findAll() {
        return utilisateurService.findAll();
    }

    // Récupérer un utilisateur par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> findById(@PathVariable Long id) {
        return utilisateurService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Ajouter un utilisateur
    @PostMapping
    public Utilisateur create(@Valid @RequestBody Utilisateur utilisateur) {
        return utilisateurService.save(utilisateur);
    }

    // Modifier un utilisateur
    @PutMapping("/{id}")
    public ResponseEntity<Utilisateur> update(
            @PathVariable Long id,
            @Valid @RequestBody Utilisateur utilisateur) {

        if (utilisateurService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        utilisateur.setId(id);

        return ResponseEntity.ok(
                utilisateurService.save(utilisateur)
        );
    }

    // Supprimer un utilisateur
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {

        if (utilisateurService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        utilisateurService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}