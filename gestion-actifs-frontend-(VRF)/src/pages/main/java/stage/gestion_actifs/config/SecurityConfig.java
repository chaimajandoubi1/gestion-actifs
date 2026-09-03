package stage.gestion_actifs.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import stage.gestion_actifs.security.JwtAuthenticationFilter;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth

                        // =========================
                        // AUTHENTIFICATION
                        // =========================
                        .requestMatchers(
                                "/api/auth/**"
                        ).permitAll()

                        // =========================
                        // ACTIFS
                        // =========================

                        // Tout utilisateur connecté peut consulter
                        .requestMatchers(HttpMethod.GET, "/api/actifs/**")
                        .hasAnyRole("ADMIN", "TECHNICIEN", "UTILISATEUR")

                        // Seul ADMIN peut créer
                        .requestMatchers(HttpMethod.POST, "/api/actifs/**")
                        .hasRole("ADMIN")

                        // Seul ADMIN peut modifier
                        .requestMatchers(HttpMethod.PUT, "/api/actifs/**")
                        .hasRole("ADMIN")

                        // Seul ADMIN peut supprimer
                        .requestMatchers(HttpMethod.DELETE, "/api/actifs/**")
                        .hasRole("ADMIN")


                        // =========================
                        // CATEGORIES
                        // =========================

                        .requestMatchers(HttpMethod.GET, "/api/categories/**")
                        .hasAnyRole("ADMIN", "TECHNICIEN", "UTILISATEUR")

                        .requestMatchers("/api/categories/**")
                        .hasRole("ADMIN")


                        // =========================
                        // UTILISATEURS
                        // =========================

                        .requestMatchers("/api/utilisateurs/**")
                        .hasRole("ADMIN")


                        // =========================
                        // AFFECTATIONS
                        // =========================

                        .requestMatchers(HttpMethod.GET, "/api/affectations/mes-affectations")
                        .hasAnyRole("ADMIN", "TECHNICIEN", "UTILISATEUR")

                        .requestMatchers(HttpMethod.GET, "/api/affectations/**")
                        .hasAnyRole("ADMIN", "TECHNICIEN")

                        .requestMatchers(
                                HttpMethod.POST,
                                "/api/affectations/**"
                        )
                        .hasAnyRole("ADMIN", "TECHNICIEN")

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/affectations/**"
                        )
                        .hasAnyRole("ADMIN", "TECHNICIEN")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/affectations/**"
                        )
                        .hasRole("ADMIN")


                        // =========================
                        // MAINTENANCES
                        // =========================

                        .requestMatchers(HttpMethod.GET, "/api/maintenances/**")
                        .hasAnyRole("ADMIN", "TECHNICIEN", "UTILISATEUR")

                        .requestMatchers("/api/maintenances/**")
                        .hasAnyRole("ADMIN", "TECHNICIEN")


                        // =========================
                        // LICENCES
                        // =========================

                        .requestMatchers(HttpMethod.GET, "/api/licences/**")
                        .hasAnyRole("ADMIN", "TECHNICIEN", "UTILISATEUR")

                        .requestMatchers("/api/licences/**")
                        .hasRole("ADMIN")


                        // =========================
                        // RAPPORTS
                        // =========================

                        .requestMatchers("/api/rapports/**")
                        .hasAnyRole("ADMIN", "TECHNICIEN")


                        // =========================
                        // ROLES
                        // =========================

                        .requestMatchers("/api/roles/**")
                        .hasRole("ADMIN")


                        // =========================
                        // TOUT LE RESTE
                        // =========================

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }


    // =========================
    // PASSWORD ENCODER
    // =========================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // =========================
    // CORS
    // =========================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

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