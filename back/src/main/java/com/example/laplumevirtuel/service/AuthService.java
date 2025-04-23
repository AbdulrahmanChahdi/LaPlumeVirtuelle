package com.example.laplumevirtuel.service;

import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final KeycloakService keycloakService;

    @Autowired
    public AuthService(UtilisateurRepository utilisateurRepository, 
                      PasswordEncoder passwordEncoder,
                      KeycloakService keycloakService) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.keycloakService = keycloakService;
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

    @Transactional
    public Utilisateur register(Utilisateur utilisateur) {
        if (utilisateurRepository.findByAdresseMail(utilisateur.getAdresseMail()).isPresent()) {
            throw new RuntimeException("Un utilisateur avec cet email existe déjà");
        }

        // Créer l'utilisateur dans Keycloak
        try {
            keycloakService.createUser(
                utilisateur.getAdresseMail(),
                utilisateur.getMotDePasse(),
                utilisateur.getNom(),
                "" // Pas de prénom dans notre modèle
            );
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la création de l'utilisateur dans Keycloak: " + e.getMessage());
        }

        // Créer l'utilisateur dans notre base de données
        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        utilisateur.setRole("USER");
        return utilisateurRepository.save(utilisateur);
    }

    private String generateToken(Utilisateur utilisateur) {
        // TODO: Implémenter la génération de token JWT
        return "dummy-token-" + utilisateur.getId();
    }
} 