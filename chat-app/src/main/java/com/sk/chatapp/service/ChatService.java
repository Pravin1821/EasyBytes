package com.sk.chatapp.service;

import com.sk.chatapp.dto.ChatMessageDto;
import com.sk.chatapp.entity.Message;
import com.sk.chatapp.entity.User;
import com.sk.chatapp.repository.MessageRepository;
import com.sk.chatapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Message saveRoomMessage(String roomId, String senderUsername, String content) {
        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new IllegalArgumentException("Unknown sender: " + senderUsername));

        Message message = Message.builder()
                .roomId(roomId)
                .sender(sender)
                .content(content)
                .isPrivate(false)
                .createdAt(Instant.now())
                .build();

        return messageRepository.save(message);
    }

    @Transactional(readOnly = true)
    public List<ChatMessageDto> getRecentRoomMessages(String roomId, int limit) {
        return messageRepository
                .findByRoomIdOrderByCreatedAtDesc(roomId, PageRequest.of(0, Math.max(limit, 1)))
                .stream()
                .map(ChatMessageDto::fromEntity)
                .toList();
    }
}
