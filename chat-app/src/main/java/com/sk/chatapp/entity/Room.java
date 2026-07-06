package com.sk.chatapp.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "rooms", indexes = {
        @Index(columnList = "name")
})
@Setter
@Getter
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(name = "is_private", nullable = false)
    private boolean isPrivate = false;

    @Column(name = "password_hash")
    private String passwordHash;

    @Column(name = "message_ttl_seconds", nullable = false)
    private long messageTtlSeconds = 86_400;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    public Room() { }

    public Room(String name, boolean isPrivate) {
        this.name = name;
        this.isPrivate = isPrivate;
        this.createdAt = Instant.now();
    }

    public Room(String name, boolean isPrivate, String passwordHash, long messageTtlSeconds) {
        this.name = name;
        this.isPrivate = isPrivate;
        this.passwordHash = passwordHash;
        this.messageTtlSeconds = messageTtlSeconds;
        this.createdAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isPrivate() {
        return isPrivate;
    }
    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public long getMessageTtlSeconds() {
        return messageTtlSeconds;
    }

    public void setMessageTtlSeconds(long messageTtlSeconds) {
        this.messageTtlSeconds = messageTtlSeconds;
    }
    public void setPrivate(boolean aPrivate) {
        isPrivate = aPrivate;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
