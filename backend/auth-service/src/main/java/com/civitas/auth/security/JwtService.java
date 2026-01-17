package com.civitas.auth.security;

import com.civitas.auth.entity.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class JwtService {

    @Value("${security.jwt.secret}")
    private String jwtSecret;

    @Value("${security.jwt.expirationMinutes:120}")
    private long expirationMinutes;

    public String generateToken(UUID userId, String email, UUID tenantId, Set<Role> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId.toString());
        if (tenantId != null) claims.put("tenantId", tenantId.toString());
        claims.put("roles", roles.stream().map(Enum::name).collect(Collectors.toList()));

        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expirationMinutes * 60);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractEmail(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }

    private Key getSigningKey() {
        // Richiede una chiave base64; se metti stringa normale, la codifichiamo noi in modo robusto:
        byte[] keyBytes;
        try {
            keyBytes = Decoders.BASE64.decode(jwtSecret);
        } catch (IllegalArgumentException e) {
            // se non è base64, usiamo i bytes raw
            keyBytes = jwtSecret.getBytes();
        }
        return Keys.hmacShaKeyFor(normalizeKey(keyBytes));
    }

    private byte[] normalizeKey(byte[] bytes) {
        // HS256 richiede almeno 256 bit (32 bytes). Se è più corta, la "allunghiamo" deterministica.
        if (bytes.length >= 32) return bytes;
        byte[] out = new byte[32];
        for (int i = 0; i < out.length; i++) out[i] = bytes[i % bytes.length];
        return out;
    }
}
