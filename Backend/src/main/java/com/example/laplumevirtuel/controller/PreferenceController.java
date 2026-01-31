package com.example.laplumevirtuel.controller;

import com.example.laplumevirtuel.entities.Preference;
import com.example.laplumevirtuel.repository.PreferenceRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/preferences")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
public class PreferenceController {

    private final PreferenceRepository preferenceRepository;

    public PreferenceController(PreferenceRepository preferenceRepository) {
        this.preferenceRepository = preferenceRepository;
    }

    @PostMapping("/save")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> savePreferences(@Valid @RequestBody Preference preference) {
        log.info("Saving preferences for user");
        try {
            Preference saved = preferenceRepository.save(preference);
            log.info("Preferences saved with ID: {}", saved.getId_preference());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            log.error("Error saving preferences: ", e);
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
