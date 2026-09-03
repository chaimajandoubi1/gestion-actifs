package stage.gestion_actifs.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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

    // Seul l'administrateur peut consulter la liste des utilisateurs.
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Utilisateur>> findAll() {
        return ResponseEntity.ok(utilisateurService.findAll());
    }

    // Seul l'administrateur peut consulter un utilisateur.
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> findById(@PathVariable Long id) {

        return utilisateurService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Seul l'administrateur peut ajouter un utilisateur.
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> create(
            @Valid @RequestBody Utilisateur utilisateur) {

        try {

            return ResponseEntity.ok(
                    utilisateurService.save(utilisateur)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Seul l'administrateur peut modifier un utilisateur.
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<?> update(
            @PathVariable Long id,
            @Valid @RequestBody Utilisateur utilisateur) {

        if (utilisateurService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        utilisateur.setId(id);

        try {

            return ResponseEntity.ok(
                    utilisateurService.save(utilisateur)
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Seul l'administrateur peut supprimer un utilisateur.
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {

        if (utilisateurService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        utilisateurService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}