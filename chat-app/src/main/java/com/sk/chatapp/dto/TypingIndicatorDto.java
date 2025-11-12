package com.sk.chatapp.dto;

import jakarta.validation.constraints.NotBlank;

public record TypingIndicatorDto(
        @NotBlank String roomId,
        @NotBlank String username,
        boolean typing
) {
}

