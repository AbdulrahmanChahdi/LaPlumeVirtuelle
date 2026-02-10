package com.example.laplumevirtuel.controller;

import com.example.laplumevirtuel.entities.Preference;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.PreferenceRepository;
import com.example.laplumevirtuel.repository.UtilisateurRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/preferences")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
public class PreferenceController {

    private final PreferenceRepository preferenceRepository;
    private final UtilisateurRepository utilisateurRepository;

    public PreferenceController(PreferenceRepository preferenceRepository, UtilisateurRepository utilisateurRepository) {
        this.preferenceRepository = preferenceRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @PostMapping("/save")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> savePreferences(@Valid @RequestBody Preference preference, Authentication authentication) {
        log.info("Saving preferences for user");
        try {
            if (authentication == null) {
                return ResponseEntity.status(401).body("Non authentifié: token manquant ou invalide");
            }

            String email = authentication.getName();
            Utilisateur utilisateur = utilisateurRepository.findByAdresseMail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

            preference.setUtilisateur(utilisateur);
            Preference savedPreference = preferenceRepository.save(preference);

            utilisateur.setPreference(savedPreference);
            utilisateurRepository.save(utilisateur);

            log.info("Preferences saved with ID: {}", savedPreference.getId_preference());
            return ResponseEntity.ok(savedPreference);
        } catch (Exception e) {
            log.error("Error saving preferences: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
