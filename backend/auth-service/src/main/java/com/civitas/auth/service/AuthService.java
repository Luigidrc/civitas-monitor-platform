package com.civitas.auth.service;

import com.civitas.auth.dto.AuthResponse;
import com.civitas.auth.dto.LoginRequest;
import com.civitas.auth.dto.RegisterRequest;
import com.civitas.auth.entity.Role;
import com.civitas.auth.entity.User;
import com.civitas.auth.repository.UserRepository;
import com.civitas.auth.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.civitas.auth.dto.MeResponse;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email().toLowerCase())) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(req.email().toLowerCase())
                .passwordHash(passwordEncoder.encode(req.password()))
                .tenantId(req.tenantId())
                .roles(Set.of(Role.CITIZEN))
                .enabled(true)
                .build();

        user = userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getTenantId(), user.getRoles());

        return new AuthResponse(
                token,
                user.getId(),
                user.getTenantId(),
                user.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
        );
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.email().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!user.isEnabled() || !passwordEncoder.matches(req.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getTenantId(), user.getRoles());

        return new AuthResponse(
                token,
                user.getId(),
                user.getTenantId(),
                user.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
        );
    }

    public MeResponse me(String email) {
        User user = userRepository.findByEmail(email.toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return new MeResponse(
                user.getId(),
                user.getEmail(),
                user.getTenantId(),
                user.getRoles().stream().map(Enum::name).collect(Collectors.toSet())
        );
    }

    public UUID getUserIdByEmail(String email) {
        return userRepository.findByEmail(email.toLowerCase())
                .map(User::getId)
                .orElse(null);
    }
}
