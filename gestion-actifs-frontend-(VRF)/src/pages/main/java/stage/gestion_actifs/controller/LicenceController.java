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

    @GetMapping
    public List<Licence> findAll() {
        return licenceService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Licence> findById(@PathVariable Long id) {
        return licenceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Licence create(@Valid @RequestBody Licence licence) {
        return licenceService.save(licence);
    }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {

        if (licenceService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        licenceService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}