package com.example.laplumevirtuel.controller;

import com.example.laplumevirtuel.entities.Preference;
import com.example.laplumevirtuel.repository.PreferenceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/preferences")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
public class PreferenceController {

    private final PreferenceRepository preferenceRepository;

    public PreferenceController(PreferenceRepository preferenceRepository) {
        this.preferenceRepository = preferenceRepository;
    }

    @PostMapping("/save")
    public ResponseEntity<?> savePreferences(@RequestBody Preference preference) {
        System.out.println("Préférence reçue: " + preference);
        try {
            Preference saved = preferenceRepository.save(preference);
            System.out.println("Préférence sauvegardée avec ID: " + saved.getId_preference());
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Erreur lors de la sauvegarde: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Erreur: " + e.getMessage());
        }
    }
}
