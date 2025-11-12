package com.sk.chatapp.controller;

import com.sk.chatapp.dto.CreateRoomRequest;
import com.sk.chatapp.entity.Room;
import com.sk.chatapp.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping
    public ResponseEntity<List<Room>> listRooms() {
        List<Room> rooms = roomRepository.findAll().stream()
                .sorted((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()))
                .toList();
        return ResponseEntity.ok(rooms);
    }

    @PostMapping
    public ResponseEntity<Room> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        String name = request.name().trim();
        if (roomRepository.findByName(name).isPresent()) {
            return ResponseEntity.status(409).build();
        }

        Room room = new Room(name.trim(), false);
        Room saved = roomRepository.save(room);
        return ResponseEntity.created(URI.create("/api/rooms/" + saved.getId())).body(saved);
    }
}
