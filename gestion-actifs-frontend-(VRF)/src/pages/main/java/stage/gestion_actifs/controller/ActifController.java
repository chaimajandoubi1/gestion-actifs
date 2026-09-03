package stage.gestion_actifs.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

import stage.gestion_actifs.entity.Actif;
import stage.gestion_actifs.service.ActifService;

import java.util.List;

@RestController
@RequestMapping("/api/actifs")
@CrossOrigin(origins = "http://localhost:5173")
public class ActifController {

    private final ActifService actifService;

    public ActifController(ActifService actifService) {
        this.actifService = actifService;
    }

    // =====================================================
    // LISTE DES ACTIFS
    //
    // ADMIN :
    // → tous les actifs
    //
    // UTILISATEUR :
    // → uniquement les actifs qui lui sont affectés
    // =====================================================

    @GetMapping
    public List<Actif> findAll(
            Authentication authentication) {

        boolean isAdmin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(auth ->
                                auth.getAuthority()
                                        .equals("ROLE_ADMIN")
                        );

        // ADMIN
        if (isAdmin) {

            return actifService.findAll();
        }

        // UTILISATEUR
        String email = authentication.getName();

        return actifService
                .findActifsByUtilisateurEmail(email);
    }

    // =====================================================
    // MES ACTIFS PAR CATÉGORIE
    // =====================================================

    @GetMapping("/mes-actifs/categorie/{categorieId}")
    public ResponseEntity<List<Actif>> mesActifsParCategorie(
            @PathVariable Long categorieId,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                actifService
                        .findActifsByUtilisateurEmailAndCategorie(
                                email,
                                categorieId
                        )
        );
    }

    // =====================================================
    // CONSULTER UN ACTIF
    //
    // ADMIN :
    // → n'importe quel actif
    //
    // UTILISATEUR :
    // → uniquement un actif qui lui est affecté
    // =====================================================

    @GetMapping("/{id}")
    public ResponseEntity<Actif> findById(
            @PathVariable Long id,
            Authentication authentication) {

        boolean isAdmin =
                authentication.getAuthorities()
                        .stream()
                        .anyMatch(auth ->
                                auth.getAuthority()
                                        .equals("ROLE_ADMIN")
                        );

        // =================================================
        // ADMIN
        // =================================================

        if (isAdmin) {

            return actifService
                    .findById(id)
                    .map(ResponseEntity::ok)
                    .orElse(
                            ResponseEntity
                                    .notFound()
                                    .build()
                    );
        }

        // =================================================
        // UTILISATEUR
        // =================================================

        String email = authentication.getName();

        boolean appartientUtilisateur =
                actifService
                        .findActifsByUtilisateurEmail(email)
                        .stream()
                        .anyMatch(actif ->
                                actif.getId().equals(id)
                        );

        // L'actif ne lui appartient pas
        if (!appartientUtilisateur) {

            return ResponseEntity
                    .status(403)
                    .build();
        }

        return actifService
                .findById(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    // =====================================================
    // CRÉER UN ACTIF
    //
    // ADMIN UNIQUEMENT
    // =====================================================

    @PostMapping
    public Actif create(
            @Valid @RequestBody Actif actif) {

        return actifService.save(actif);
    }

    // =====================================================
    // MODIFIER UN ACTIF
    //
    // ADMIN UNIQUEMENT
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<Actif> update(
            @PathVariable Long id,
            @Valid @RequestBody Actif actif) {

        if (actifService.findById(id).isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        actif.setId(id);

        return ResponseEntity.ok(
                actifService.save(actif)
        );
    }

    // =====================================================
    // SUPPRIMER UN ACTIF
    //
    // ADMIN UNIQUEMENT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(
            @PathVariable Long id) {

        if (actifService.findById(id).isEmpty()) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        actifService.deleteById(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}