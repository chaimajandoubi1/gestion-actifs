package stage.gestion_actifs.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import stage.gestion_actifs.entity.Maintenance;
import stage.gestion_actifs.service.MaintenanceService;

import java.util.List;

@RestController
@RequestMapping("/api/maintenances")
@CrossOrigin(origins = "http://localhost:5173")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    // Cette méthode permet de consulter toutes les maintenances.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @GetMapping
    public ResponseEntity<List<Maintenance>> findAll() {

        return ResponseEntity.ok(
                maintenanceService.findAll()
        );
    }

    // Cette méthode permet de consulter une maintenance précise.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> findById(
            @PathVariable Long id) {

        return maintenanceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Cette méthode permet à l'administrateur et au technicien d'ajouter une maintenance.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @PostMapping
    public ResponseEntity<Maintenance> create(
            @Valid @RequestBody Maintenance maintenance) {

        return ResponseEntity.ok(
                maintenanceService.save(maintenance)
        );
    }

    // Cette méthode permet à l'administrateur et au technicien de modifier une maintenance.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @PutMapping("/{id}")
    public ResponseEntity<Maintenance> update(
            @PathVariable Long id,
            @Valid @RequestBody Maintenance maintenance) {

        if (maintenanceService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        maintenance.setId(id);

        return ResponseEntity.ok(
                maintenanceService.save(maintenance)
        );
    }

    // Cette méthode permet à l'administrateur et au technicien de supprimer une maintenance.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(
            @PathVariable Long id) {

        if (maintenanceService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        maintenanceService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}