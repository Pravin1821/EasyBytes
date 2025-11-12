package com.sk.chatapp.dto;

import java.time.Instant;

public record UserDto(
        Long id,
        String username,
        String displayName,
        String email,
        Instant createdAt
) {
}

