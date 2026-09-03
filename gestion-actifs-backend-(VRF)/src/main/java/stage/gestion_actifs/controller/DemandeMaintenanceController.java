package stage.gestion_actifs.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import stage.gestion_actifs.dto.DemandeMaintenanceRequest;
import stage.gestion_actifs.dto.TraitementRequest;
import stage.gestion_actifs.entity.DemandeMaintenance;
import stage.gestion_actifs.service.DemandeMaintenanceService;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/demandes-maintenance")
@CrossOrigin(origins = "http://localhost:5173")
public class DemandeMaintenanceController {

    private final DemandeMaintenanceService demandeMaintenanceService;

    public DemandeMaintenanceController(
            DemandeMaintenanceService demandeMaintenanceService) {

        this.demandeMaintenanceService = demandeMaintenanceService;
    }

    // ADMIN / TECHNICIEN : consulter toutes les demandes de maintenance.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @GetMapping
    public ResponseEntity<List<DemandeMaintenance>> findAll() {
        return ResponseEntity.ok(demandeMaintenanceService.findAll());
    }

    // Tout utilisateur connecté : consulter ses propres demandes.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @GetMapping("/mes-demandes")
    public ResponseEntity<List<DemandeMaintenance>> mesDemandes(
            Authentication authentication) {

        return ResponseEntity.ok(
                demandeMaintenanceService.findByUtilisateurEmail(
                        authentication.getName()
                )
        );
    }

    // ADMIN / TECHNICIEN : consulter une demande précise.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @GetMapping("/{id}")
    public ResponseEntity<DemandeMaintenance> findById(
            @PathVariable Long id) {

        return demandeMaintenanceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Tout utilisateur connecté : signaler un problème sur un actif.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @PostMapping
    public ResponseEntity<?> creer(
            @Valid @RequestBody DemandeMaintenanceRequest requete,
            Authentication authentication) {

        try {

            DemandeMaintenance demande =
                    demandeMaintenanceService.creer(
                            requete,
                            authentication.getName()
                    );

            return ResponseEntity.ok(demande);

        } catch (NoSuchElementException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ADMIN / TECHNICIEN : traiter une demande de maintenance.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @PutMapping("/{id}/traiter")
    public ResponseEntity<?> traiter(
            @PathVariable Long id,
            @Valid @RequestBody TraitementRequest requete,
            Authentication authentication) {

        try {

            DemandeMaintenance demande =
                    demandeMaintenanceService.traiter(
                            id,
                            requete,
                            authentication.getName()
                    );

            return ResponseEntity.ok(demande);

        } catch (NoSuchElementException e) {

            return ResponseEntity.notFound().build();
        }
    }

    // ADMIN : supprimer une demande de maintenance.
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {

        if (demandeMaintenanceService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        demandeMaintenanceService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}
