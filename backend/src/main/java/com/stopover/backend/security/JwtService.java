package com.stopover.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    // Convierte el secreto de texto en una llave criptográfica que firma el token
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    // Genera un token que incluye el email del usuario y su rol
    public String generarToken(String email, String rol) {
        Date ahora = new Date();
        Date expira = new Date(ahora.getTime() + expiration);

        return Jwts.builder()
                .subject(email)
                .claim("rol", rol)
                .issuedAt(ahora)
                .expiration(expira)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Extrae el email (subject) del token
    public String extraerEmail(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Extrae el rol guardado en el token
    public String extraerRol(String token) {
        return (String) Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .get("rol");
    }

    // Verifica que el token no esté expirado ni corrupto
    public boolean esValido(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}