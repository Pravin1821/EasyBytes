package com.sk.chatapp.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "messages", indexes = {
        @Index(columnList = "room_id"),
        @Index(columnList = "target_user")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", length = 120)
    private String roomId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private User sender;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Builder.Default
    @Column(name = "is_private", nullable = false)
    private boolean isPrivate = false;

    @Column(name = "target_user", length = 100)
    private String targetUser;

    @Builder.Default
    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    // Convenience constructors
    public Message(String roomId, User sender, String content) {
        this.roomId = roomId;
        this.sender = sender;
        this.content = content;
        this.isPrivate = false;
        this.createdAt = Instant.now();
    }

    public Message(User sender, String targetUser, String content) {
        this.sender = sender;
        this.targetUser = targetUser;
        this.content = content;
        this.isPrivate = true;
        this.createdAt = Instant.now();
    }
}
