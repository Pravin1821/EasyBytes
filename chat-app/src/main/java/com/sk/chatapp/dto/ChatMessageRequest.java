package com.sk.chatapp.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatMessageRequest(
        @NotBlank(message = "Sender is required")
        String sender,

        @NotBlank(message = "Message content cannot be empty")
        @Size(max = 2000, message = "Message cannot exceed 2000 characters")
        String content
) {
}

