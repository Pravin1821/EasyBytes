package com.sk.chatapp.dto;

import com.sk.chatapp.entity.Message;

import java.time.Instant;

public record ChatMessageDto(
        Long id,
        String roomId,
        String sender,
        String senderDisplayName,
        String content,
        boolean isDirectMessage,
        String targetUser,
        Instant createdAt,
        Instant expiresAt
) {
    public static ChatMessageDto fromEntity(Message message) {
        return new ChatMessageDto(
                message.getId(),
                message.isDirectMessage() ? null : message.getRoomId(),
                message.getSender() != null ? message.getSender().getUsername() : null,
                message.getSender() != null ? message.getSender().getDisplayName() : null,
                message.getContent(),
                message.isDirectMessage(),
                message.getTargetUser(),
                message.getCreatedAt(),
                message.getExpiresAt()
        );
    }
}
