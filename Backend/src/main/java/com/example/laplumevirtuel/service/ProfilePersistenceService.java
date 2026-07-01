package com.example.laplumevirtuel.service;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.document.OnboardingProfileDocument;
import com.example.laplumevirtuel.dto.ProfileRequest;
import com.example.laplumevirtuel.repository.OnboardingProfileRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ProfilePersistenceService {

    private final OnboardingProfileRepository onboardingProfileRepository;

    public ProfilePersistenceService(OnboardingProfileRepository onboardingProfileRepository) {
        this.onboardingProfileRepository = onboardingProfileRepository;
    }

    public OnboardingProfileDocument saveOrUpdateProfile(Long userId, ProfileRequest request) {
        Instant now = Instant.now();

        OnboardingProfileDocument profile = onboardingProfileRepository.findByUserId(userId)
                .orElseGet(() -> OnboardingProfileDocument.builder()
                        .userId(userId)
                        .createdAt(now)
                        .build());

        profile.setAgeRange(request.getAgeRange());
        profile.setObjectives(sanitizeList(request.getObjectives()));
        profile.setFormats(sanitizeList(request.getFormats()));
        profile.setGenres(sanitizeList(request.getGenres()));
        profile.setReadingLevel(request.getReadingLevel());
        profile.setSessionTime(request.getSessionTime());
        profile.setMoments(sanitizeList(request.getMoments()));
        profile.setDiscoveryPreference(request.getDiscoveryPreference());
        profile.setConsent(request.getConsent());
        profile.setFavorites(request.getFavorites());
        profile.setTasteDescription(request.getTasteDescription());
        profile.setTexteLibre(request.getTexteLibre());

        if (profile.getCreatedAt() == null) {
            profile.setCreatedAt(now);
        }
        profile.setUpdatedAt(now);

        OnboardingProfileDocument saved = onboardingProfileRepository.save(profile);
        log.info("Onboarding profile saved in MongoDB for userId={}", userId);
        return saved;
    }

    private List<String> sanitizeList(List<String> values) {
        if (values == null) {
            return List.of();
        }

        return values.stream()
                .map(String::trim)
                .filter(v -> !v.isEmpty())
                .distinct()
                .collect(Collectors.toList());
    }
}
