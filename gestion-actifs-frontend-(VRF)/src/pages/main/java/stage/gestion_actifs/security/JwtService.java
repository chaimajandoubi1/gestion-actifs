package stage.gestion_actifs.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long expiration;

    public JwtService(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration) {

        this.secretKey = Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );

        this.expiration = expiration;
    }

    public String generateToken(
            String email,
            String nom,
            String role) {

        Date maintenant = new Date();

        Date dateExpiration =
                new Date(
                        maintenant.getTime() + expiration
                );

        return Jwts.builder()
                .subject(email)
                .claim("nom", nom)
                .claim("role", role)
                .issuedAt(maintenant)
                .expiration(dateExpiration)
                .signWith(secretKey)
                .compact();
    }

    public String extractUsername(String token) {

        return extractAllClaims(token)
                .getSubject();
    }

    public String extractRole(String token) {

        return extractAllClaims(token)
                .get("role", String.class);
    }

    public String extractNom(String token) {

        return extractAllClaims(token)
                .get("nom", String.class);
    }

    public boolean isTokenValid(
            String token,
            String email) {

        try {

            String username =
                    extractUsername(token);

            return username.equals(email)
                    && !isTokenExpired(token);

        } catch (Exception e) {

            return false;
        }
    }

    private boolean isTokenExpired(String token) {

        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}