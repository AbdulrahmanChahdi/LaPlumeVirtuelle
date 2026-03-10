package com.example.laplumevirtuel.service;

import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.UtilisateurRepository;
import com.example.laplumevirtuel.security.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public Map<String, Object> login(String email, String password) {
        Optional<Utilisateur> utilisateur = utilisateurRepository.findByAdresseMailIgnoreCase(email == null ? null : email.trim());

        if (utilisateur.isEmpty() || !passwordEncoder.matches(password, utilisateur.get().getMotDePasse())) {
            log.warn("Login attempt failed for email: {}", email);
            throw new RuntimeException("Utilisateur non trouvé ou mot de passe incorrect");
        }

        log.info("User logged in: {}", email);
        Map<String, Object> response = new HashMap<>();
        response.put("user", utilisateur.get());
        response.put("token", generateToken(utilisateur.get()));
        return response;
    }

    public Utilisateur register(Utilisateur utilisateur) {
        if (utilisateurRepository.findByAdresseMailIgnoreCase(utilisateur.getAdresseMail()).isPresent()) {
            log.warn("Registration failed - email already exists: {}", utilisateur.getAdresseMail());
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        utilisateur.setRole("USER");
        Utilisateur saved = utilisateurRepository.save(utilisateur);
        log.info("New user registered: {}", utilisateur.getAdresseMail());
        return saved;
    }

    private String generateToken(Utilisateur utilisateur) {
        return jwtUtil.generateToken(
                utilisateur.getAdresseMail(),
                utilisateur.getId(),
                utilisateur.getRole());
    }
}