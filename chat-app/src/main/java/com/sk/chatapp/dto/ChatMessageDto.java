package com.sk.chatapp.dto;

import com.sk.chatapp.entity.Message;

import java.time.Instant;

public record ChatMessageDto(
        Long id,
        String roomId,
        String sender,
        String senderDisplayName,
        String content,
        boolean isPrivate,
        String targetUser,
        Instant createdAt
) {
    public static ChatMessageDto fromEntity(Message message) {
        return new ChatMessageDto(
                message.getId(),
                message.isPrivate() ? null : message.getRoomId(),
                message.getSender() != null ? message.getSender().getUsername() : null,
                message.getSender() != null ? message.getSender().getDisplayName() : null,
                message.getContent(),
                message.isPrivate(),
                message.getTargetUser(),
                message.getCreatedAt()
        );
    }
}
