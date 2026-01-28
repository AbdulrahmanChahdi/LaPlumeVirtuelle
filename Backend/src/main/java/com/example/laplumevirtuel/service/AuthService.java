package com.example.laplumevirtuel.service;

import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.UtilisateurRepository;
import com.example.laplumevirtuel.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
        Optional<Utilisateur> utilisateur = utilisateurRepository.findByAdresseMail(email);

        if (utilisateur.isEmpty() || !passwordEncoder.matches(password, utilisateur.get().getMotDePasse())) {
            throw new RuntimeException("Utilisateur non trouvé ou mot de passe incorrect");
        }

        Map<String, Object> response = new HashMap<>();
        response.put("user", utilisateur.get());
        response.put("token", generateToken(utilisateur.get()));
        return response;
    }

    public Utilisateur register(Utilisateur utilisateur) {
        if (utilisateurRepository.findByAdresseMail(utilisateur.getAdresseMail()).isPresent()) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        utilisateur.setRole("USER");
        return utilisateurRepository.save(utilisateur);
    }

    private String generateToken(Utilisateur utilisateur) {
        return jwtUtil.generateToken(
                utilisateur.getAdresseMail(),
                utilisateur.getId(),
                utilisateur.getRole());
    }
}