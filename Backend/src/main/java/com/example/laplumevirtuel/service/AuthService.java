package com.example.laplumevirtuel.service;

import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
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
        // TODO: Implémenter la génération de token JWT
        return "dummy-token-" + utilisateur.getId();
    }
} 