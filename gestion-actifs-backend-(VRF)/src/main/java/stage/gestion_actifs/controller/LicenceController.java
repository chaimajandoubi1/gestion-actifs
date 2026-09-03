package stage.gestion_actifs.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import stage.gestion_actifs.entity.Licence;
import stage.gestion_actifs.service.LicenceService;

import java.util.List;

@RestController
@RequestMapping("/api/licences")
@CrossOrigin(origins = "http://localhost:5173")
public class LicenceController {

    private final LicenceService licenceService;

    public LicenceController(LicenceService licenceService) {
        this.licenceService = licenceService;
    }

    // Les utilisateurs autorisés peuvent consulter les licences.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @GetMapping
    public ResponseEntity<List<Licence>> findAll() {

        return ResponseEntity.ok(
                licenceService.findAll()
        );
    }

    // Les utilisateurs autorisés peuvent consulter une licence.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN', 'UTILISATEUR')")
    @GetMapping("/{id}")
    public ResponseEntity<Licence> findById(
            @PathVariable Long id) {

        return licenceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // L'administrateur et le technicien peuvent ajouter une licence.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @PostMapping
    public ResponseEntity<Licence> create(
            @Valid @RequestBody Licence licence) {

        return ResponseEntity.ok(
                licenceService.save(licence)
        );
    }

    // L'administrateur et le technicien peuvent modifier une licence.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @PutMapping("/{id}")
    public ResponseEntity<Licence> update(
            @PathVariable Long id,
            @Valid @RequestBody Licence licence) {

        if (licenceService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        licence.setId(id);

        return ResponseEntity.ok(
                licenceService.save(licence)
        );
    }

    // L'administrateur et le technicien peuvent supprimer une licence.
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIEN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(
            @PathVariable Long id) {

        if (licenceService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        licenceService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}