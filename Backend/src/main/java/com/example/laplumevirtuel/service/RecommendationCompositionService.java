package com.example.laplumevirtuel.service;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.document.OnboardingProfileDocument;
import com.example.laplumevirtuel.dto.RecommendationsResponse;
import com.example.laplumevirtuel.entities.Livre;
import com.example.laplumevirtuel.entities.LivreAudio;
import com.example.laplumevirtuel.entities.Podcast;
import com.example.laplumevirtuel.repository.LivreAudioRepository;
import com.example.laplumevirtuel.repository.LivreRepository;
import com.example.laplumevirtuel.repository.OnboardingProfileRepository;
import com.example.laplumevirtuel.repository.PodcastRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class RecommendationCompositionService {

    private final OnboardingProfileRepository onboardingProfileRepository;
    private final NlpRecommendationClient nlpRecommendationClient;
    private final LivreRepository livreRepository;
    private final LivreAudioRepository livreAudioRepository;
    private final PodcastRepository podcastRepository;

    public RecommendationCompositionService(
            OnboardingProfileRepository onboardingProfileRepository,
            NlpRecommendationClient nlpRecommendationClient,
            LivreRepository livreRepository,
            LivreAudioRepository livreAudioRepository,
            PodcastRepository podcastRepository) {
        this.onboardingProfileRepository = onboardingProfileRepository;
        this.nlpRecommendationClient = nlpRecommendationClient;
        this.livreRepository = livreRepository;
        this.livreAudioRepository = livreAudioRepository;
        this.podcastRepository = podcastRepository;
    }

    public RecommendationsResponse buildRecommendationsForUser(Long userId, int limit) {
        OnboardingProfileDocument profile = onboardingProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalStateException("Aucun profil onboarding trouve pour cet utilisateur"));

        List<NlpRecommendationClient.NlpRecommendationItem> nlpItems = nlpRecommendationClient.fetchRecommendations(
                userId,
                profile.getFormats(),
                profile.getGenres(),
                profile.getTexteLibre(),
                limit);

        List<RecommendationsResponse.RecommendationCard> cards = new ArrayList<>();
        Set<String> uniqueKeys = new LinkedHashSet<>();

        for (NlpRecommendationClient.NlpRecommendationItem item : nlpItems) {
            RecommendationsResponse.RecommendationCard card = resolveCard(item);
            if (card == null) {
                continue;
            }

            String key = card.getType() + ":" + card.getId();
            if (uniqueKeys.add(key)) {
                cards.add(card);
            }

            if (cards.size() >= limit) {
                break;
            }
        }

        return RecommendationsResponse.builder()
                .userId(userId)
                .recommendations(cards)
                .total(cards.size())
                .build();
    }

    private RecommendationsResponse.RecommendationCard resolveCard(NlpRecommendationClient.NlpRecommendationItem item) {
        if (item == null) {
            return null;
        }

        String normalizedType = normalizeType(item.getType());
        RecommendationsResponse.RecommendationCard resolved = switch (normalizedType) {
            case "livre" -> resolveLivre(item);
            case "livreAudio" -> resolveLivreAudio(item);
            case "podcast" -> resolvePodcast(item);
            default -> resolveFallback(item);
        };

        if (resolved != null) {
            return resolved;
        }

        return buildNlpFallbackCard(item);
    }

    private RecommendationsResponse.RecommendationCard resolveLivre(NlpRecommendationClient.NlpRecommendationItem item) {
        Optional<Livre> candidate = Optional.empty();

        if (hasText(item.getId())) {
            Long numericId = parseLong(item.getId());
            if (numericId != null) {
                candidate = livreRepository.findById(numericId);
            }
            if (candidate.isEmpty()) {
                candidate = livreRepository.findByExternalId(item.getId());
            }
        }

        if (candidate.isEmpty() && hasText(item.getTitle())) {
            candidate = livreRepository.searchByKeyword(item.getTitle()).stream().findFirst();
        }

        if (candidate.isEmpty()) {
            return null;
        }

        Livre livre = candidate.get();
        Set<String> tags = new LinkedHashSet<>();
        tags.add("Livre");
        if (livre.getCategorie() != null && hasText(livre.getCategorie().getNom())) {
            tags.add(livre.getCategorie().getNom());
        }
        if (item.getTags() != null) {
            item.getTags().stream().filter(this::hasText).forEach(tags::add);
        }

        String author = item.getAuthor();
        if (livre.getAuteur() != null && hasText(livre.getAuteur().getNom())) {
            author = livre.getAuteur().getNom();
        }

        return RecommendationsResponse.RecommendationCard.builder()
                .id(String.valueOf(livre.getId()))
                .type("livre")
                .title(livre.getTitre())
                .author(author)
                .coverUrl(hasText(livre.getImageUrl()) ? livre.getImageUrl() : item.getCoverUrl())
                .tags(new ArrayList<>(tags))
                .score(item.getScore())
                .favorite(Boolean.FALSE)
                .build();
    }

    private RecommendationsResponse.RecommendationCard resolveLivreAudio(NlpRecommendationClient.NlpRecommendationItem item) {
        Optional<LivreAudio> candidate = Optional.empty();

        if (hasText(item.getId())) {
            Long numericId = parseLong(item.getId());
            if (numericId != null) {
                candidate = livreAudioRepository.findById(numericId);
            }
        }

        if (candidate.isEmpty() && hasText(item.getTitle())) {
            candidate = livreAudioRepository.searchLivresAudio(item.getTitle()).stream().findFirst();
        }

        if (candidate.isEmpty()) {
            return null;
        }

        LivreAudio livreAudio = candidate.get();
        Set<String> tags = new LinkedHashSet<>();
        tags.add("Livre audio");
        if (livreAudio.getLivre() != null
                && livreAudio.getLivre().getCategorie() != null
                && hasText(livreAudio.getLivre().getCategorie().getNom())) {
            tags.add(livreAudio.getLivre().getCategorie().getNom());
        }
        if (item.getTags() != null) {
            item.getTags().stream().filter(this::hasText).forEach(tags::add);
        }

        String author = hasText(livreAudio.getNarrateur()) ? livreAudio.getNarrateur() : item.getAuthor();
        if (!hasText(author)
                && livreAudio.getLivre() != null
                && livreAudio.getLivre().getAuteur() != null
                && hasText(livreAudio.getLivre().getAuteur().getNom())) {
            author = livreAudio.getLivre().getAuteur().getNom();
        }

        String coverUrl = item.getCoverUrl();
        if (livreAudio.getLivre() != null && hasText(livreAudio.getLivre().getImageUrl())) {
            coverUrl = livreAudio.getLivre().getImageUrl();
        }

        return RecommendationsResponse.RecommendationCard.builder()
                .id(String.valueOf(livreAudio.getId()))
                .type("livreAudio")
                .title(livreAudio.getTitre())
                .author(author)
                .coverUrl(coverUrl)
                .tags(new ArrayList<>(tags))
                .score(item.getScore())
                .favorite(Boolean.FALSE)
                .build();
    }

    private RecommendationsResponse.RecommendationCard resolvePodcast(NlpRecommendationClient.NlpRecommendationItem item) {
        Optional<Podcast> candidate = Optional.empty();

        if (hasText(item.getId())) {
            Long numericId = parseLong(item.getId());
            if (numericId != null) {
                candidate = podcastRepository.findById(numericId);
            }
        }

        if (candidate.isEmpty() && hasText(item.getTitle())) {
            candidate = podcastRepository.searchPodcasts(item.getTitle()).stream().findFirst();
        }

        if (candidate.isEmpty()) {
            return null;
        }

        Podcast podcast = candidate.get();
        Set<String> tags = new LinkedHashSet<>();
        tags.add("Podcast");
        if (hasText(podcast.getTheme())) {
            tags.add(podcast.getTheme());
        }
        if (item.getTags() != null) {
            item.getTags().stream().filter(this::hasText).forEach(tags::add);
        }

        return RecommendationsResponse.RecommendationCard.builder()
                .id(String.valueOf(podcast.getId()))
                .type("podcast")
                .title(podcast.getNom())
                .author(hasText(podcast.getAnimateur()) ? podcast.getAnimateur() : item.getAuthor())
                .coverUrl(hasText(podcast.getImageUrl()) ? podcast.getImageUrl() : item.getCoverUrl())
                .tags(new ArrayList<>(tags))
                .score(item.getScore())
                .favorite(Boolean.FALSE)
                .build();
    }

    private RecommendationsResponse.RecommendationCard resolveFallback(NlpRecommendationClient.NlpRecommendationItem item) {
        RecommendationsResponse.RecommendationCard livre = resolveLivre(item);
        if (livre != null) {
            return livre;
        }

        RecommendationsResponse.RecommendationCard audio = resolveLivreAudio(item);
        if (audio != null) {
            return audio;
        }

        RecommendationsResponse.RecommendationCard podcast = resolvePodcast(item);
        if (podcast != null) {
            return podcast;
        }

        return buildNlpFallbackCard(item);
    }

    private RecommendationsResponse.RecommendationCard buildNlpFallbackCard(NlpRecommendationClient.NlpRecommendationItem item) {
        if (item == null || !hasText(item.getTitle())) {
            return null;
        }

        String normalizedType = normalizeType(item.getType());
        String safeType = switch (normalizedType) {
            case "livre", "livreAudio", "podcast" -> normalizedType;
            default -> "livre";
        };

        Set<String> tags = new LinkedHashSet<>();
        if (item.getTags() != null) {
            item.getTags().stream().filter(this::hasText).forEach(tags::add);
        }

        if (tags.isEmpty()) {
            tags.add(safeType.equals("livreAudio") ? "Livre audio" : safeType.substring(0, 1).toUpperCase() + safeType.substring(1));
        }

        String fallbackId = hasText(item.getId()) ? item.getId() : (safeType + ":" + item.getTitle());

        return RecommendationsResponse.RecommendationCard.builder()
                .id(fallbackId)
                .type(safeType)
                .title(item.getTitle())
                .author(hasText(item.getAuthor()) ? item.getAuthor() : "Auteur inconnu")
                .coverUrl(item.getCoverUrl())
                .tags(new ArrayList<>(tags))
                .score(item.getScore())
                .favorite(Boolean.FALSE)
                .build();
    }

    private String normalizeType(String type) {
        if (!hasText(type)) {
            return "unknown";
        }

        String value = type.trim().toLowerCase();
        if (value.equals("livre") || value.equals("book") || value.equals("ebook")) {
            return "livre";
        }
        if (value.equals("livreaudio") || value.equals("livre_audio") || value.equals("audio")
                || value.equals("audiobook")) {
            return "livreAudio";
        }
        if (value.equals("podcast")) {
            return "podcast";
        }
        return "unknown";
    }

    private Long parseLong(String value) {
        if (!hasText(value)) {
            return null;
        }

        try {
            return Long.parseLong(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }
}
