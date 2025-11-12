package com.sk.chatapp.config;

import com.sk.chatapp.entity.Room;
import com.sk.chatapp.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final List<String> DEFAULT_ROOMS = List.of("general", "random", "support");

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public void run(String... args) {
        if (roomRepository.count() == 0) {
            DEFAULT_ROOMS.forEach(name -> roomRepository.save(new Room(name, false)));
        }
    }
}

