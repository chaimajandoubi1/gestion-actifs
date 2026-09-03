package stage.gestion_actifs.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import stage.gestion_actifs.security.JwtAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http

                .csrf(csrf -> csrf.disable())

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .authorizeHttpRequests(auth -> auth

                        // LOGIN
                        .requestMatchers(
                                "/api/auth/**",
                                "/error"
                        ).permitAll()

                        // ACTIFS

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/actifs/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN",
                                "UTILISATEUR"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/actifs/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/actifs/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/actifs/**"
                        ).hasRole("ADMIN")

                        // CATEGORIES

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/categories/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN",
                                "UTILISATEUR"
                        )

                        .requestMatchers(
                                "/api/categories/**"
                        ).hasRole("ADMIN")

                        // UTILISATEURS

                        .requestMatchers(
                                "/api/utilisateurs/**"
                        ).hasRole("ADMIN")

                        // AFFECTATIONS

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/affectations/mes-affectations"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN",
                                "UTILISATEUR"
                        )

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/affectations"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/affectations/*"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/affectations/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/affectations/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/affectations/**"
                        ).hasRole("ADMIN")

                        // MAINTENANCES

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/maintenances/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN",
                                "UTILISATEUR"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/maintenances/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN"
                        )

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/maintenances/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN"
                        )

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/maintenances/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN"
                        )

                        // LICENCES

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/licences/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN",
                                "UTILISATEUR"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/licences/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN"
                        )

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/licences/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN"
                        )

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/licences/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN"
                        )

                        // DEMANDES (maintenance, actif, licence)
                        // Les trois workflows suivent la même logique :
                        // - création : tout utilisateur authentifié
                        // - consultation globale + traitement : ADMIN, TECHNICIEN
                        // - suppression : ADMIN uniquement
                        // ("/mes-demandes" est explicitement ouvert à tous
                        //  avant la règle générale sur "/**" ci-dessous.)

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/demandes-maintenance/mes-demandes",
                                "/api/demandes-actif/mes-demandes",
                                "/api/demandes-licence/mes-demandes"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN",
                                "UTILISATEUR"
                        )

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/demandes-maintenance/**",
                                "/api/demandes-actif/**",
                                "/api/demandes-licence/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN"
                        )

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/demandes-maintenance/**",
                                "/api/demandes-actif/**",
                                "/api/demandes-licence/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN",
                                "UTILISATEUR"
                        )

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/demandes-maintenance/**",
                                "/api/demandes-actif/**",
                                "/api/demandes-licence/**"
                        ).hasAnyRole(
                                "ADMIN",
                                "TECHNICIEN"
                        )

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/demandes-maintenance/**",
                                "/api/demandes-actif/**",
                                "/api/demandes-licence/**"
                        ).hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}