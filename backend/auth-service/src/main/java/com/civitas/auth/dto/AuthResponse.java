package com.civitas.auth.dto;

import java.util.Set;
import java.util.UUID;

public record AuthResponse(
        String token,
        UUID userId,
        UUID tenantId,
        Set<String> roles
) {}
