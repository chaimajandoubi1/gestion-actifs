package stage.gestion_actifs.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import stage.gestion_actifs.dto.AffectationResponse;
import stage.gestion_actifs.entity.Affectation;
import stage.gestion_actifs.service.AffectationService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/affectations")
@CrossOrigin(origins = "http://localhost:5173")
public class AffectationController {

    private final AffectationService affectationService;

    public AffectationController(
            AffectationService affectationService) {

        this.affectationService = affectationService;
    }

    // =========================================================
    // Convertir une entité Affectation en réponse JSON
    // =========================================================

    private AffectationResponse convertir(
            Affectation affectation) {

        return new AffectationResponse(

                affectation.getId(),

                // Actif
                affectation.getActif() != null
                        ? affectation.getActif().getId()
                        : null,

                affectation.getActif() != null
                        ? affectation.getActif().getNom()
                        : null,

                affectation.getActif() != null
                        ? affectation.getActif().getMarque()
                        : null,

                affectation.getActif() != null
                        ? affectation.getActif().getModele()
                        : null,

                affectation.getActif() != null
                        ? affectation.getActif().getNumeroSerie()
                        : null,

                // Utilisateur
                affectation.getUtilisateur() != null
                        ? affectation.getUtilisateur().getId()
                        : null,

                affectation.getUtilisateur() != null
                        ? affectation.getUtilisateur().getNom()
                        : null,

                affectation.getUtilisateur() != null
                        ? affectation.getUtilisateur().getEmail()
                        : null,

                // Dates
                affectation.getDateDebut(),

                affectation.getDateFin()
        );
    }


    // =========================================================
    // ADMIN : récupérer toutes les affectations
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<AffectationResponse>> findAll() {

        List<AffectationResponse> resultats =
                affectationService.findAll()
                        .stream()
                        .map(this::convertir)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(resultats);
    }


    // =========================================================
    // TECHNICIEN / UTILISATEUR :
    // récupérer leurs affectations
    // =========================================================

    @PreAuthorize("hasAnyRole('TECHNICIEN', 'UTILISATEUR')")
    @GetMapping("/mes-affectations")
    public ResponseEntity<List<AffectationResponse>> mesAffectations(
            Authentication authentication) {

        String email = authentication.getName();

        List<AffectationResponse> resultats =
                affectationService
                        .findByUtilisateurEmail(email)
                        .stream()
                        .map(this::convertir)
                        .collect(Collectors.toList());

        return ResponseEntity.ok(resultats);
    }


    // =========================================================
    // ADMIN : récupérer une affectation
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<AffectationResponse> findById(
            @PathVariable Long id) {

        return affectationService.findById(id)
                .map(this::convertir)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity.notFound().build()
                );
    }


    // =========================================================
    // ADMIN : créer une affectation
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<Affectation> create(
            @Valid @RequestBody Affectation affectation) {

        Affectation nouvelleAffectation =
                affectationService.save(affectation);

        return ResponseEntity.ok(
                nouvelleAffectation
        );
    }


    // =========================================================
    // ADMIN : modifier une affectation
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
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

        return ResponseEntity.ok(
                affectationService.save(affectation)
        );
    }


    // =========================================================
    // ADMIN : supprimer une affectation
    // =========================================================

    @PreAuthorize("hasRole('ADMIN')")
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