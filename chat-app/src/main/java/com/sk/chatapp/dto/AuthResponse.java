package com.sk.chatapp.dto;

public record AuthResponse(
        String accessToken,
        UserDto user
) {
}
