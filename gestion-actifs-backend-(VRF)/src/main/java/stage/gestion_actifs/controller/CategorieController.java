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
import stage.gestion_actifs.entity.Categorie;
import stage.gestion_actifs.service.CategorieService;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategorieController {

    private final CategorieService categorieService;

    public CategorieController(CategorieService categorieService) {
        this.categorieService = categorieService;
    }

    @GetMapping
    public List<Categorie> findAll() {
        return categorieService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categorie> findById(@PathVariable Long id) {
        return categorieService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Categorie create(@Valid @RequestBody Categorie categorie) {
        return categorieService.save(categorie);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categorie> update(
            @PathVariable Long id,
            @Valid @RequestBody Categorie categorie) {

        if (categorieService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        categorie.setId(id);
        return ResponseEntity.ok(categorieService.save(categorie));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Long id) {
        if (categorieService.findById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        categorieService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}