package com.sk.chatapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRoomRequest(
        @NotBlank(message = "Room name is required")
        @Size(min = 2, max = 120)
        String name
) {
}

