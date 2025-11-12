package com.sk.chatapp.service;

import com.sk.chatapp.dto.UserDto;
import com.sk.chatapp.entity.User;
import com.sk.chatapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User register(String username, String email, String password, String displayName) {
        userRepository.findByUsername(username).ifPresent(existing -> {
            throw new IllegalArgumentException("Username already in use");
        });
        userRepository.findByEmail(email).ifPresent(existing -> {
            throw new IllegalArgumentException("Email already in use");
        });

        String hashed = passwordEncoder.encode(password);
        User user = new User(username, email, hashed, displayName);
        try {
            return userRepository.save(user);
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalStateException("Unable to register user", ex);
        }
    }

    public Optional<User> findByUsernameOrEmail(String usernameOrEmail) {
        Optional<User> userOpt = userRepository.findByUsername(usernameOrEmail);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(usernameOrEmail);
        }
        return userOpt;
    }

    public boolean checkPassword(String rawPassword, String hashed) {
        return passwordEncoder.matches(rawPassword, hashed);
    }

    public UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getDisplayName(),
                user.getEmail(),
                user.getCreatedAt()
        );
    }
}
