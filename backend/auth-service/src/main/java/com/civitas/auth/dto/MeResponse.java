package com.civitas.auth.dto;

import java.util.Set;
import java.util.UUID;

public record MeResponse(
        UUID userId,
        String email,
        UUID tenantId,
        Set<String> roles
) {}
