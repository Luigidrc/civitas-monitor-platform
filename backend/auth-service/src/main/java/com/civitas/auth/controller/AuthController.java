package com.civitas.auth.controller;

import com.civitas.auth.dto.AuthResponse;
import com.civitas.auth.dto.LoginRequest;
import com.civitas.auth.dto.MeResponse;
import com.civitas.auth.dto.RegisterRequest;
import com.civitas.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public AuthResponse register(@Valid @RequestBody RegisterRequest req) {
        return authService.register(req);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest req) {
        return authService.login(req);
    }

    @GetMapping("/me")
    public MeResponse me(Authentication auth) {
        // Authentication principal contiene l'email (vedi JwtAuthFilter)
        return authService.me(auth.getName());
    }

    @GetMapping("/health")
        public String health() {
        return "OK";
    }

}
