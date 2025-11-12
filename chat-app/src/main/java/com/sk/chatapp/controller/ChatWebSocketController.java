package com.sk.chatapp.controller;

import com.sk.chatapp.dto.ChatMessageDto;
import com.sk.chatapp.dto.ChatMessageRequest;
import com.sk.chatapp.dto.TypingIndicatorDto;
import com.sk.chatapp.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatWebSocketController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/rooms/{roomId}")
    public void handleRoomMessage(
            @DestinationVariable String roomId,
            @Valid ChatMessageRequest payload) {

        ChatMessageDto saved = ChatMessageDto.fromEntity(
                chatService.saveRoomMessage(roomId, payload.sender(), payload.content())
        );

        messagingTemplate.convertAndSend("/topic/rooms/" + roomId, saved);
    }

    @MessageMapping("/rooms/{roomId}/typing")
    public void handleTypingIndicator(
            @DestinationVariable String roomId,
            @Valid TypingIndicatorDto payload) {

        messagingTemplate.convertAndSend("/topic/rooms/" + roomId + "/typing", payload);
    }

    @MessageExceptionHandler
    public void handleMessagingException(Exception exception) {
        messagingTemplate.convertAndSend("/queue/errors", exception.getMessage());
    }
}

