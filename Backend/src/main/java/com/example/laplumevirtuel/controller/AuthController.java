package com.example.laplumevirtuel.controller;

import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("adresseMail");
        String password = credentials.get("motDePasse");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Map<String, Object> response = authService.login(email, password);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Utilisateur utilisateur) {
        try {
            Utilisateur newUser = authService.register(utilisateur);
            return ResponseEntity.ok(newUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 