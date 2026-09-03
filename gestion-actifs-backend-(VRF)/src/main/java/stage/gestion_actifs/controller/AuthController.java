package stage.gestion_actifs.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import stage.gestion_actifs.dto.LoginRequest;
import stage.gestion_actifs.dto.LoginResponse;
import stage.gestion_actifs.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        try {

            LoginResponse response =
                    authService.login(request);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(401)
                    .body(e.getMessage());
        }
    }
}