package stage.gestion_actifs.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthenticationFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // Cette méthode intercepte chaque requête afin de vérifier le JWT.
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String requestUri = request.getRequestURI();

        // La connexion ne nécessite pas encore de token JWT.
        if (requestUri.equals("/api/auth/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader =
                request.getHeader("Authorization");

        // Cette information permet de vérifier la présence du token.
        System.out.println("======================================");
        System.out.println(
                "REQUETE : "
                        + request.getMethod()
                        + " "
                        + requestUri
        );

        System.out.println(
                "Authorization présente : "
                        + (authHeader != null)
        );

        // La requête continue sans authentification si aucun token n'est fourni.
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println("Aucun token JWT");

            filterChain.doFilter(request, response);
            return;
        }

        // Cette partie récupère uniquement la valeur du JWT.
        String token = authHeader.substring(7);

        try {

            // Le nom d'utilisateur est récupéré depuis le token.
            String username =
                    jwtService.extractUsername(token);

            System.out.println(
                    "JWT USERNAME : " + username
            );

            // Cette partie vérifie que la requête n'est pas déjà authentifiée.
            if (username != null &&
                    SecurityContextHolder
                            .getContext()
                            .getAuthentication() == null) {

                // Cette partie vérifie la validité du token.
                boolean tokenValide =
                        jwtService.isTokenValid(
                                token,
                                username
                        );

                System.out.println(
                        "TOKEN VALIDE : " + tokenValide
                );

                if (tokenValide) {

                    // Le rôle est récupéré depuis le JWT.
                    String role =
                            jwtService.extractRole(token);

                    System.out.println(
                            "JWT ROLE : " + role
                    );

                    // Cette partie vérifie que le rôle existe.
                    if (role == null ||
                            role.trim().isEmpty()) {

                        System.out.println(
                                "ERREUR : ROLE ABSENT DU JWT"
                        );

                        filterChain.doFilter(
                                request,
                                response
                        );

                        return;
                    }

                    // Le rôle est normalisé afin d'éviter les différences de format.
                    String roleNormalise =
                            role.trim().toUpperCase();

                    // Le préfixe ROLE_ est supprimé avant de reconstruire l'autorité.
                    if (roleNormalise.startsWith("ROLE_")) {

                        roleNormalise =
                                roleNormalise.substring(5);
                    }

                    System.out.println(
                            "ROLE NORMALISE : "
                                    + roleNormalise
                    );

                    // Les rôles reconnus par la sécurité de l'application
                    // sont uniquement ADMIN, TECHNICIEN et UTILISATEUR.
                    // Tout autre intitulé (ex : un ancien compte créé avant
                    // la séparation rôle/poste, ou une donnée importée) est
                    // ramené par défaut à UTILISATEUR — le rôle le moins
                    // privilégié — plutôt que de bloquer complètement
                    // l'accès à l'application (ce qui provoquait auparavant
                    // un 403 en cascade sur toutes les pages).
                    if (!roleNormalise.equals("ADMIN")
                            && !roleNormalise.equals("TECHNICIEN")
                            && !roleNormalise.equals("UTILISATEUR")) {

                        System.out.println(
                                "ROLE INCONNU : "
                                        + roleNormalise
                                        + " -> repli sur UTILISATEUR"
                        );

                        roleNormalise = "UTILISATEUR";
                    }

                    // Spring Security utilise le préfixe ROLE_ pour hasRole().
                    String authorityName =
                            "ROLE_" + roleNormalise;

                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority(
                                    authorityName
                            );

                    System.out.println(
                            "AUTHORITY : "
                                    + authority.getAuthority()
                    );

                    // Cette partie crée l'utilisateur authentifié pour la requête.
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    username,
                                    null,
                                    Collections.singletonList(
                                            authority
                                    )
                            );

                    // Les informations de la requête sont associées à l'authentification.
                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    // L'authentification est enregistrée dans Spring Security.
                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );

                    System.out.println(
                            "AUTHENTIFICATION INSTALLEE"
                    );

                    System.out.println(
                            "UTILISATEUR AUTHENTIFIE : "
                                    + authentication.getName()
                    );

                    System.out.println(
                            "AUTORITES : "
                                    + authentication.getAuthorities()
                    );
                }
            }

        } catch (Exception e) {

            // Cette partie affiche l'erreur lorsqu'un JWT ne peut pas être traité.
            System.out.println(
                    "ERREUR JWT : "
                            + e.getClass().getSimpleName()
                            + " - "
                            + e.getMessage()
            );
        }

        System.out.println("======================================");

        // La requête continue vers les contrôleurs.
        filterChain.doFilter(request, response);
    }
}