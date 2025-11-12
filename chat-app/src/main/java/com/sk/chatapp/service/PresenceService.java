package com.sk.chatapp.service;

import com.sk.chatapp.dto.UserPresenceDto;
import com.sk.chatapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class PresenceService {

    private final Map<String, String> sessionToUsername = new ConcurrentHashMap<>();
    private final Map<String, Instant> userLastSeen = new ConcurrentHashMap<>();

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    public void registerSession(String sessionId, String username) {
        sessionToUsername.put(sessionId, username);
        userLastSeen.put(username, Instant.now());
        broadcastPresence();
    }

    public void unregisterSession(String sessionId) {
        String username = sessionToUsername.remove(sessionId);
        if (username != null) {
            userLastSeen.put(username, Instant.now());
            broadcastPresence();
        }
    }

    public Set<String> getOnlineUsers() {
        return sessionToUsername.values().stream()
                .filter(Objects::nonNull)
                .collect(Collectors.toCollection(java.util.LinkedHashSet::new));
    }

    public Collection<UserPresenceDto> getPresenceSnapshot() {
        return userRepository.findAll().stream()
                .map(user -> new UserPresenceDto(
                        user.getUsername(),
                        user.getDisplayName(),
                        isOnline(user.getUsername()),
                        userLastSeen.get(user.getUsername())
                ))
                .toList();
    }

    public boolean isOnline(String username) {
        return sessionToUsername.containsValue(username);
    }

    public void broadcastPresence() {
        messagingTemplate.convertAndSend("/topic/presence", getPresenceSnapshot());
    }
}

