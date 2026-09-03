package stage.gestion_actifs.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import stage.gestion_actifs.dto.LoginRequest;
import stage.gestion_actifs.dto.LoginResponse;
import stage.gestion_actifs.entity.Utilisateur;
import stage.gestion_actifs.Repository.UtilisateurRepository;
import stage.gestion_actifs.security.JwtService;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.utilisateurRepository =
                utilisateurRepository;

        this.passwordEncoder =
                passwordEncoder;

        this.jwtService =
                jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        Utilisateur utilisateur =
                utilisateurRepository
                        .findByEmail(request.getEmail())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Email ou mot de passe incorrect"
                                )
                        );

        if (!passwordEncoder.matches(
                request.getMotDePasse(),
                utilisateur.getMotDePasse())) {

            throw new RuntimeException(
                    "Email ou mot de passe incorrect"
            );
        }

        String role = utilisateur.getRole();

        if (role == null || role.trim().isEmpty()) {

            throw new RuntimeException(
                    "Le rôle de cet utilisateur est manquant."
            );
        }

        role = role.trim().toUpperCase();

        if (role.startsWith("ROLE_")) {
            role = role.substring(5);
        }

        String token =
                jwtService.generateToken(
                        utilisateur.getEmail(),
                        utilisateur.getNom(),
                        role
                );

        return new LoginResponse(
                utilisateur.getId(),
                token,
                utilisateur.getNom(),
                utilisateur.getEmail(),
                role
        );
    }
}