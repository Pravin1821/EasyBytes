package com.sk.chatapp.dto;

import java.time.Instant;

public record UserPresenceDto(
        String username,
        String displayName,
        boolean online,
        Instant lastSeen
) {
}

