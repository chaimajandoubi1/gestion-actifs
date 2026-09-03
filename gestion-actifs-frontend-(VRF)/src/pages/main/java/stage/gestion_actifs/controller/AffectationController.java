package stage.gestion_actifs.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import stage.gestion_actifs.entity.Affectation;
import stage.gestion_actifs.service.AffectationService;

import java.util.List;

@RestController
@RequestMapping("/api/affectations")
@CrossOrigin(origins = "http://localhost:5173")
public class AffectationController {

    private final AffectationService affectationService;

    public AffectationController(
            AffectationService affectationService) {

        this.affectationService = affectationService;
    }

    // =====================================================
    // ADMIN :
    // TOUTES LES AFFECTATIONS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Affectation>> findAll() {

        return ResponseEntity.ok(
                affectationService.findAll()
        );
    }

    // =====================================================
    // UTILISATEUR :
    // UNIQUEMENT SES AFFECTATIONS
    // =====================================================

    @GetMapping("/mes-affectations")
    public ResponseEntity<List<Affectation>> mesAffectations(
            Authentication authentication) {

        // Email récupéré depuis le JWT
        String email = authentication.getName();

        System.out.println(
                "Utilisateur connecté : " + email
        );

        List<Affectation> affectations =
                affectationService
                        .findByUtilisateurEmail(email);

        return ResponseEntity.ok(affectations);
    }

    // =====================================================
    // RECHERCHER UNE AFFECTATION PAR ID
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Affectation> findById(
            @PathVariable Long id) {

        return affectationService
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }

    // =====================================================
    // AJOUTER UNE AFFECTATION
    // ADMIN
    // =====================================================

    @PostMapping
    public ResponseEntity<Affectation> create(
            @Valid @RequestBody Affectation affectation) {

        Affectation nouvelleAffectation =
                affectationService.save(affectation);

        return ResponseEntity.ok(
                nouvelleAffectation
        );
    }

    // =====================================================
    // MODIFIER UNE AFFECTATION
    // ADMIN
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<Affectation> update(
            @PathVariable Long id,
            @Valid @RequestBody Affectation affectation) {

        if (affectationService.findById(id).isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        affectation.setId(id);

        Affectation affectationModifiee =
                affectationService.save(affectation);

        return ResponseEntity.ok(
                affectationModifiee
        );
    }

    // =====================================================
    // SUPPRIMER UNE AFFECTATION
    // ADMIN
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(
            @PathVariable Long id) {

        if (affectationService.findById(id).isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        affectationService.deleteById(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}