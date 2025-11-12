package com.sk.chatapp.websocket;

import com.sk.chatapp.service.PresenceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.lang.Nullable;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    @Autowired
    private PresenceService presenceService;

    @EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        String username = resolveUsername(accessor);

        if (sessionId != null && username != null) {
            presenceService.registerSession(sessionId, username);
        }
    }

    @EventListener
    public void handleSessionDisconnected(SessionDisconnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = accessor.getSessionId();
        if (sessionId != null) {
            presenceService.unregisterSession(sessionId);
        }
    }

    @Nullable
    private String resolveUsername(StompHeaderAccessor accessor) {
        String username = accessor.getFirstNativeHeader("username");
        if (username != null && !username.isBlank()) {
            return username;
        }

        Object attr = accessor.getSessionAttributes() != null
                ? accessor.getSessionAttributes().get("username")
                : null;

        if (attr instanceof String attrUsername && !attrUsername.isBlank()) {
            return attrUsername;
        }

        return null;
    }
}

