package com.sk.chatapp.repository;

import com.sk.chatapp.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByRoomIdOrderByCreatedAtDesc(String roomId, Pageable pageable);

    Page<Message> findByTargetUserOrderByCreatedAtDesc(String targetUser, Pageable pageable);
}
