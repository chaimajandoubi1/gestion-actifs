package stage.gestion_actifs.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import stage.gestion_actifs.dto.DemandeActifRequest;
import stage.gestion_actifs.dto.TraitementRequest;
import stage.gestion_actifs.entity.DemandeActif;
import stage.gestion_actifs.service.DemandeActifService;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/demandes-actif")
@CrossOrigin(origins = "http://localhost:5173")
public class DemandeActifController {

    private final DemandeActifService demandeActifService;

    public DemandeActifController(DemandeActifService demandeActifService) {
        this.demandeActifService = demandeActifService;
    }

    // ADMIN / TECHNICIEN : consulter toutes les demandes d'actif.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @GetMapping
    public ResponseEntity<List<DemandeActif>> findAll() {
        return ResponseEntity.ok(demandeActifService.findAll());
    }

    // Tout utilisateur connecté : consulter ses propres demandes.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @GetMapping("/mes-demandes")
    public ResponseEntity<List<DemandeActif>> mesDemandes(
            Authentication authentication) {

        return ResponseEntity.ok(
                demandeActifService.findByUtilisateurEmail(
                        authentication.getName()
                )
        );
    }

    // ADMIN / TECHNICIEN : consulter une demande précise.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @GetMapping("/{id}")
    public ResponseEntity<DemandeActif> findById(@PathVariable Long id) {

        return demandeActifService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tout utilisateur connecté : demander un nouvel actif.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @PostMapping
    public ResponseEntity<?> creer(
            @Valid @RequestBody DemandeActifRequest requete,
            Authentication authentication) {

        try {

            DemandeActif demande =
                    demandeActifService.creer(
                            requete,
                            authentication.getName()
                    );

            return ResponseEntity.ok(demande);

        } catch (NoSuchElementException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ADMIN / TECHNICIEN : traiter une demande d'actif.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @PutMapping("/{id}/traiter")
    public ResponseEntity<?> traiter(
            @PathVariable Long id,
            @Valid @RequestBody TraitementRequest requete,
            Authentication authentication) {

        try {

            DemandeActif demande =
                    demandeActifService.traiter(
                            id,
                            requete,
                            authentication.getName()
                    );

            return ResponseEntity.ok(demande);

        } catch (NoSuchElementException e) {

            return ResponseEntity.notFound().build();
        }
    }

    // ADMIN : supprimer une demande d'actif.
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {

        if (demandeActifService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        demandeActifService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
