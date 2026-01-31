package com.example.laplumevirtuel.controller;

import com.example.laplumevirtuel.dto.UserDTO;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.service.AuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
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
            log.warn("Login attempt with missing credentials");
            return ResponseEntity.badRequest().build();
        }

        try {
            Map<String, Object> response = authService.login(email, password);
            
            // Map to DTO to exclude password
            Utilisateur user = (Utilisateur) response.get("user");
            UserDTO userDTO = mapToDTO(user);
            
            Map<String, Object> secureResponse = new HashMap<>();
            secureResponse.put("user", userDTO);
            secureResponse.put("token", response.get("token"));
            
            return ResponseEntity.ok(secureResponse);
        } catch (RuntimeException e) {
            log.error("Login error: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Utilisateur utilisateur) {
        try {
            Utilisateur newUser = authService.register(utilisateur);
            UserDTO userDTO = mapToDTO(newUser);
            return ResponseEntity.ok(userDTO);
        } catch (RuntimeException e) {
            log.error("Registration error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private UserDTO mapToDTO(Utilisateur user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setNom(user.getNom());
        dto.setAdresseMail(user.getAdresseMail());
        dto.setAdressePostal(user.getAdressePostal());
        dto.setTel(user.getTel());
        dto.setRole(user.getRole());
        dto.setDateInscription(user.getDateInscription());
        return dto;
    }
}
 