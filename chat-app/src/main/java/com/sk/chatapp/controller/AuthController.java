package com.sk.chatapp.controller;

import com.sk.chatapp.dto.AuthResponse;
import com.sk.chatapp.dto.LoginRequest;
import com.sk.chatapp.dto.RegisterRequest;
import com.sk.chatapp.dto.UserDto;
import com.sk.chatapp.entity.User;
import com.sk.chatapp.service.JwtService;
import com.sk.chatapp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        String displayName = Optional.ofNullable(request.displayName())
                .filter(name -> !name.isBlank())
                .orElse(request.username());

        try {
            User user = userService.register(request.username(), request.email(), request.password(), displayName);
            return ResponseEntity.status(HttpStatus.CREATED).body(userService.toDto(user));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", ex.getMessage()));
        } catch (IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        Optional<User> maybeUser = userService.findByUsernameOrEmail(request.usernameOrEmail());
        if (maybeUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        User user = maybeUser.get();
        if (!userService.checkPassword(request.password(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid credentials"));
        }

        String token = jwtService.generateToken(user.getUsername());
        AuthResponse response = new AuthResponse(token, userService.toDto(user));
        return ResponseEntity.ok(response);
    }
}
