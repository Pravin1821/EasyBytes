package com.sk.chatapp.controller;

import com.sk.chatapp.dto.ChatMessageDto;
import com.sk.chatapp.dto.UserPresenceDto;
import com.sk.chatapp.service.ChatService;
import com.sk.chatapp.service.PresenceService;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api")
@Validated
public class ChatRestController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private PresenceService presenceService;

    @GetMapping("/messages/rooms/{roomId}")
    public ResponseEntity<List<ChatMessageDto>> getRoomMessages(
            @PathVariable String roomId,
            @RequestParam(defaultValue = "50") @Min(1) @Max(200) int limit
    ) {
        List<ChatMessageDto> messages = chatService.getRecentRoomMessages(roomId, limit).stream()
                .sorted(Comparator.comparing(ChatMessageDto::createdAt))
                .toList();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/presence")
    public ResponseEntity<Collection<UserPresenceDto>> getPresence() {
        return ResponseEntity.ok(presenceService.getPresenceSnapshot());
    }
}

