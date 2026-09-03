package stage.gestion_actifs.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import stage.gestion_actifs.entity.Actif;
import stage.gestion_actifs.service.ActifService;

import java.util.List;

@RestController
@RequestMapping("/api/actifs")
@CrossOrigin(origins = "http://localhost:5173")
public class ActifController {

    private final ActifService actifService;

    public ActifController(ActifService actifService) {
        this.actifService = actifService;
    }

    // Les trois rôles peuvent consulter les actifs.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @GetMapping
    public ResponseEntity<List<Actif>> findAll(
            Authentication authentication) {

        String role = getRole(authentication);

        // L'administrateur et le technicien voient tous les actifs.
        if (role.equals("ADMIN") || role.equals("TECHNICIEN")) {
            return ResponseEntity.ok(actifService.findAll());
        }

        // L'utilisateur voit uniquement ses actifs affectés.
        String email = authentication.getName();

        return ResponseEntity.ok(
                actifService.findActifsByUtilisateurEmail(email)
        );
    }

    // Les trois rôles peuvent filtrer les actifs par catégorie.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @GetMapping("/mes-actifs/categorie/{categorieId}")
    public ResponseEntity<List<Actif>> mesActifsParCategorie(
            @PathVariable Long categorieId,
            Authentication authentication) {

        String role = getRole(authentication);

        // L'administrateur et le technicien voient tous les actifs de la catégorie.
        if (role.equals("ADMIN") || role.equals("TECHNICIEN")) {

            List<Actif> actifs = actifService.findAll()
                    .stream()
                    .filter(actif ->
                            actif.getCategorie() != null
                                    && actif.getCategorie().getId().equals(categorieId)
                    )
                    .toList();

            return ResponseEntity.ok(actifs);
        }

        // L'utilisateur voit uniquement ses actifs de la catégorie.
        String email = authentication.getName();

        return ResponseEntity.ok(
                actifService.findActifsByUtilisateurEmailAndCategorie(
                        email,
                        categorieId
                )
        );
    }

    // Les trois rôles peuvent consulter un actif.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<Actif> findById(
            @PathVariable Long id,
            Authentication authentication) {

        String role = getRole(authentication);

        // L'administrateur et le technicien peuvent consulter tous les actifs.
        if (role.equals("ADMIN") || role.equals("TECHNICIEN")) {

            return actifService.findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        // L'utilisateur peut consulter uniquement un actif qui lui est affecté.
        String email = authentication.getName();

        boolean appartientUtilisateur =
                actifService.findActifsByUtilisateurEmail(email)
                        .stream()
                        .anyMatch(actif -> actif.getId().equals(id));

        if (!appartientUtilisateur) {
            return ResponseEntity.status(403).build();
        }

        return actifService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Seul l'administrateur peut ajouter un actif.
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Actif> create(
            @Valid @RequestBody Actif actif) {

        return ResponseEntity.ok(
                actifService.save(actif)
        );
    }

    // Seul l'administrateur peut modifier un actif.
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<Actif> update(
            @PathVariable Long id,
            @Valid @RequestBody Actif actif) {

        if (actifService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        actif.setId(id);

        return ResponseEntity.ok(
                actifService.save(actif)
        );
    }

    // Seul l'administrateur peut supprimer un actif.
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(
            @PathVariable Long id) {

        if (actifService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        actifService.deleteById(id);

        return ResponseEntity.noContent().build();
    }

    // Cette méthode récupère le rôle de l'utilisateur connecté.
    private String getRole(Authentication authentication) {

        return authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(authority -> {

                    String role = authority.getAuthority();

                    if (role.startsWith("ROLE_")) {
                        role = role.substring(5);
                    }

                    return role.toUpperCase();
                })
                .orElse("");
    }
}