package com.sk.chatapp;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ChatAppApplication {
    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.load();
        System.setProperty("DB_URL", dotenv.get("DATASOURCE_URL"));
        System.setProperty("DB_USER", dotenv.get("DATASOURCE_USER"));
        System.setProperty("DB_PASSWORD", dotenv.get("DATASOURCE_PASSWORD"));

        SpringApplication.run(ChatAppApplication.class, args);
    }
}

