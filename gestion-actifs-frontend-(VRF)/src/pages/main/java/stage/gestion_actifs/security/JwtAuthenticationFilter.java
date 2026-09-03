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

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        System.out.println("======================================");
        System.out.println("REQUETE : " + request.getMethod() + " " + request.getRequestURI());
        System.out.println("Authorization présente : " + (authHeader != null));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {

            System.out.println("Aucun token JWT");

            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        try {

            String username = jwtService.extractUsername(token);

            System.out.println("JWT USERNAME : " + username);

            if (username != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                if (jwtService.isTokenValid(token, username)) {

                    String role = jwtService.extractRole(token);

                    System.out.println("JWT ROLE : " + role);

                    if (role != null) {

                        String roleNormalise = role.toUpperCase();

                        SimpleGrantedAuthority authority =
                                new SimpleGrantedAuthority(
                                        "ROLE_" + roleNormalise
                                );

                        System.out.println(
                                "AUTHORITY : " + authority.getAuthority()
                        );

                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(
                                        username,
                                        null,
                                        Collections.singletonList(authority)
                                );

                        authentication.setDetails(
                                new WebAuthenticationDetailsSource()
                                        .buildDetails(request)
                        );

                        SecurityContextHolder
                                .getContext()
                                .setAuthentication(authentication);

                        System.out.println(
                                "AUTHENTIFICATION INSTALLEE"
                        );

                    } else {

                        System.out.println(
                                "ERREUR : ROLE NULL DANS LE JWT"
                        );
                    }

                } else {

                    System.out.println(
                            "ERREUR : TOKEN JWT INVALIDE OU EXPIRE"
                    );
                }
            }

        } catch (Exception e) {

            System.out.println(
                    "ERREUR JWT : " + e.getMessage()
            );
        }

        System.out.println("======================================");

        filterChain.doFilter(request, response);
    }
}