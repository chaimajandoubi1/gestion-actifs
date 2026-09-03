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

    @GetMapping
    public List<Maintenance> findAll() {
        return maintenanceService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> findById(@PathVariable Long id) {
        return maintenanceService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Maintenance create(@Valid @RequestBody Maintenance maintenance) {
        return maintenanceService.save(maintenance);
    }

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {

        if (maintenanceService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        maintenanceService.deleteById(id);

        return ResponseEntity.noContent().build();
    }
}