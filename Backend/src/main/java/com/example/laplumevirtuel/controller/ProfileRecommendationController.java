package com.example.laplumevirtuel.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.laplumevirtuel.dto.ProfileRequest;
import com.example.laplumevirtuel.dto.RecommendationsResponse;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.UtilisateurRepository;
import com.example.laplumevirtuel.service.ProfilePersistenceService;
import com.example.laplumevirtuel.service.RecommendationCompositionService;

import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:5173", "http://localhost:5174" })
@Slf4j
public class ProfileRecommendationController {

    private final UtilisateurRepository utilisateurRepository;
    private final ProfilePersistenceService profilePersistenceService;
    private final RecommendationCompositionService recommendationCompositionService;

    public ProfileRecommendationController(
            UtilisateurRepository utilisateurRepository,
            ProfilePersistenceService profilePersistenceService,
            RecommendationCompositionService recommendationCompositionService) {
        this.utilisateurRepository = utilisateurRepository;
        this.profilePersistenceService = profilePersistenceService;
        this.recommendationCompositionService = recommendationCompositionService;
    }

    @PostMapping("/profile")
    public ResponseEntity<?> saveProfile(@Valid @RequestBody ProfileRequest request, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return error(HttpStatus.UNAUTHORIZED, "Non authentifie");
        }

        try {
            Utilisateur utilisateur = resolveAuthenticatedUser(authentication.getName());
            profilePersistenceService.saveOrUpdateProfile(utilisateur.getId(), request);

            return ResponseEntity.ok(Map.of(
                    "message", "Profil enregistre avec succes",
                    "userId", utilisateur.getId()));
        } catch (IllegalArgumentException e) {
            log.warn("POST /api/profile failed: {}", e.getMessage());
            return error(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error in POST /api/profile", e);
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur lors de l'enregistrement du profil");
        }
    }

    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(
            Authentication authentication,
            @RequestParam(defaultValue = "12") Integer limit) {
        if (authentication == null || authentication.getName() == null) {
            return error(HttpStatus.UNAUTHORIZED, "Non authentifie");
        }

        int safeLimit = sanitizeLimit(limit);

        try {
            Utilisateur utilisateur = resolveAuthenticatedUser(authentication.getName());
            RecommendationsResponse response = recommendationCompositionService
                    .buildRecommendationsForUser(utilisateur.getId(), safeLimit);

            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.warn("GET /api/recommendations failed: {}", e.getMessage());
            return error(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (IllegalStateException e) {
            log.warn("GET /api/recommendations business error: {}", e.getMessage());
            return error(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            log.error("Unexpected error in GET /api/recommendations", e);
            return error(HttpStatus.INTERNAL_SERVER_ERROR, "Erreur lors de la recuperation des recommandations");
        }
    }

    private Utilisateur resolveAuthenticatedUser(String email) {
        return utilisateurRepository.findByAdresseMail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
    }

    private int sanitizeLimit(Integer limit) {
        if (limit == null) {
            return 12;
        }
        return Math.max(1, Math.min(limit, 50));
    }

    private ResponseEntity<Map<String, String>> error(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of("error", message));
    }
}
