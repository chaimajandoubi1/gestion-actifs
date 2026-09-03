package stage.gestion_actifs.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import stage.gestion_actifs.dto.DemandeLicenceRequest;
import stage.gestion_actifs.dto.TraitementRequest;
import stage.gestion_actifs.entity.DemandeLicence;
import stage.gestion_actifs.service.DemandeLicenceService;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/demandes-licence")
@CrossOrigin(origins = "http://localhost:5173")
public class DemandeLicenceController {

    private final DemandeLicenceService demandeLicenceService;

    public DemandeLicenceController(DemandeLicenceService demandeLicenceService) {
        this.demandeLicenceService = demandeLicenceService;
    }

    // ADMIN / TECHNICIEN : consulter toutes les demandes de licence.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @GetMapping
    public ResponseEntity<List<DemandeLicence>> findAll() {
        return ResponseEntity.ok(demandeLicenceService.findAll());
    }

    // Tout utilisateur connecté : consulter ses propres demandes.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @GetMapping("/mes-demandes")
    public ResponseEntity<List<DemandeLicence>> mesDemandes(
            Authentication authentication) {

        return ResponseEntity.ok(
                demandeLicenceService.findByUtilisateurEmail(
                        authentication.getName()
                )
        );
    }

    // ADMIN / TECHNICIEN : consulter une demande précise.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @GetMapping("/{id}")
    public ResponseEntity<DemandeLicence> findById(@PathVariable Long id) {

        return demandeLicenceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tout utilisateur connecté : demander l'accès à une licence.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @PostMapping
    public ResponseEntity<?> creer(
            @Valid @RequestBody DemandeLicenceRequest requete,
            Authentication authentication) {

        try {

            DemandeLicence demande =
                    demandeLicenceService.creer(
                            requete,
                            authentication.getName()
                    );

            return ResponseEntity.ok(demande);

        } catch (NoSuchElementException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ADMIN / TECHNICIEN : traiter une demande de licence.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @PutMapping("/{id}/traiter")
    public ResponseEntity<?> traiter(
            @PathVariable Long id,
            @Valid @RequestBody TraitementRequest requete,
            Authentication authentication) {

        try {

            DemandeLicence demande =
                    demandeLicenceService.traiter(
                            id,
                            requete,
                            authentication.getName()
                    );

            return ResponseEntity.ok(demande);

        } catch (NoSuchElementException e) {

            return ResponseEntity.notFound().build();
        }
    }

    // ADMIN : supprimer une demande de licence.
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {

        if (demandeLicenceService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        demandeLicenceService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
