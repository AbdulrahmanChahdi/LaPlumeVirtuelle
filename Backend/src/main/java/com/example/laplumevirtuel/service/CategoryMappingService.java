package com.example.laplumevirtuel.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service pour mapper les catégories d'Open Library vers les thématiques
 * françaises du système
 */
@Service
public class CategoryMappingService {

    private static final Map<String, Set<String>> CATEGORY_MAPPING = new HashMap<>();
        private static final Map<String, String> CANONICAL_CATEGORY_NAMES = new HashMap<>();

    static {
        // Science & Technology
        CATEGORY_MAPPING.put("science", Set.of(
                "science", "sciences", "popular science", "scientific", "physics", "chemistry",
                "biology", "astronomy", "astrophysics", "neuroscience", "neurosciences",
                "technology", "innovation", "research", "science fiction"));

        // Policier & Mystery
        CATEGORY_MAPPING.put("policier", Set.of(
                "mystery", "detective", "crime", "thriller", "suspense", "noir",
                "police", "investigation", "murder", "mystery & detective stories",
                "detective and mystery stories", "criminal investigation"));

        // Romance
        CATEGORY_MAPPING.put("romance", Set.of(
                "romance", "love stories", "romantic", "love", "relationships",
                "contemporary romance", "historical romance"));

        // Thriller
        CATEGORY_MAPPING.put("thriller", Set.of(
                "thriller", "thrillers", "suspense", "psychological thriller",
                "action", "spy stories", "espionage"));

        // Fantasy
        CATEGORY_MAPPING.put("fantasy", Set.of(
                "fantasy", "magic", "wizards", "dragons", "epic fantasy",
                "urban fantasy", "dark fantasy", "sword and sorcery",
                "magical realism"));

        // Science Fiction
        CATEGORY_MAPPING.put("science fiction", Set.of(
                "science fiction", "sci-fi", "cyberpunk", "dystopia", "dystopian",
                "space opera", "futuristic", "aliens", "time travel"));

        // Histoire
        CATEGORY_MAPPING.put("histoire", Set.of(
                "history", "historical", "world history", "military history",
                "ancient history", "modern history", "civilization",
                "historical fiction", "biography", "biographies"));

        // Philosophie
        CATEGORY_MAPPING.put("philosophie", Set.of(
                "philosophy", "philosophers", "ethics", "metaphysics",
                "existentialism", "logic", "epistemology"));

        // Business
        CATEGORY_MAPPING.put("business", Set.of(
                "business", "entrepreneurship", "management", "leadership",
                "economics", "finance", "investing", "startup", "marketing",
                "strategy", "innovation"));

        // Psychologie
        CATEGORY_MAPPING.put("psychologie", Set.of(
                "psychology", "psychological", "psychiatry", "mental health",
                "cognitive science", "behavioral science", "self-help",
                "personal development", "mindfulness"));

        // Art
        CATEGORY_MAPPING.put("art", Set.of(
                "art", "arts", "painting", "sculpture", "artists",
                "art history", "design", "architecture", "photography"));

        // Biographie
        CATEGORY_MAPPING.put("biographie", Set.of(
                "biography", "biographies", "autobiography", "memoir",
                "memoirs", "autobiographies", "life stories"));

        // Aventure
        CATEGORY_MAPPING.put("aventure", Set.of(
                "adventure", "adventures", "exploration", "survival",
                "travel", "voyages", "expeditions"));

        // Humour
        CATEGORY_MAPPING.put("humour", Set.of(
                "humor", "humour", "comedy", "satire", "parody",
                "comic", "funny", "jokes"));

        // Dystopie
        CATEGORY_MAPPING.put("dystopie", Set.of(
                "dystopia", "dystopian", "post-apocalyptic", "apocalyptic",
                "utopia", "utopian"));

        // Nature & Environnement
        CATEGORY_MAPPING.put("nature", Set.of(
                "nature", "environment", "ecology", "wildlife", "animals",
                "climate", "sustainability", "conservation"));

        // Santé
        CATEGORY_MAPPING.put("sante", Set.of(
                "health", "medicine", "medical", "nutrition", "diet",
                "fitness", "wellness", "healing"));

        // Spiritualité
        CATEGORY_MAPPING.put("spiritualite", Set.of(
                "spirituality", "religion", "meditation", "mindfulness",
                "philosophy", "zen", "buddhism", "mysticism"));

        // Young Adult
        CATEGORY_MAPPING.put("young-adult", Set.of(
                "young adult", "teen", "teenage", "ya", "coming of age",
                "adolescent", "juvenile fiction"));

        // Classique
        CATEGORY_MAPPING.put("classique", Set.of(
                "classics", "classic", "literature", "literary",
                "canonical", "great books"));

        // Horreur
        CATEGORY_MAPPING.put("horreur", Set.of(
                "horror", "scary", "ghost", "supernatural", "occult",
                "terror", "frightening"));

        // Poésie
        CATEGORY_MAPPING.put("poesie", Set.of(
                "poetry", "poems", "verse", "poets"));

        // Guerre
        CATEGORY_MAPPING.put("guerre", Set.of(
                "war", "warfare", "military", "battle", "combat",
                "world war", "conflict"));

        // Géopolitique
        CATEGORY_MAPPING.put("geopolitique", Set.of(
                "geopolitics", "international relations", "diplomacy",
                "foreign policy", "global politics", "world politics"));

        // Manga & Anime
        CATEGORY_MAPPING.put("manga", Set.of(
                "manga", "anime", "comic", "comics", "graphic novel",
                "japanese comics"));

        // Cuisine
        CATEGORY_MAPPING.put("gastronomie", Set.of(
                "cooking", "cookbooks", "recipes", "food", "cuisine",
                "gastronomy", "culinary"));

        CATEGORY_MAPPING.put("roman historique", Set.of(
                "historical fiction", "historical novel", "period drama", "roman historique"));

        CATEGORY_MAPPING.put("conte et legende", Set.of(
                "folklore", "fairy tales", "fables", "mythology", "legends", "contes"));

        CATEGORY_MAPPING.put("essai", Set.of(
                "essay", "essays", "criticism", "social commentary", "non-fiction"));

        CATEGORY_MAPPING.put("developpement personnel", Set.of(
                "self-help", "personal growth", "motivation", "productivity", "habits"));

        CATEGORY_MAPPING.put("theatre", Set.of(
                "theater", "theatre", "plays", "drama"));

        CATEGORY_MAPPING.put("voyage", Set.of(
                "travel", "travel writing", "guidebooks", "voyages"));

        CANONICAL_CATEGORY_NAMES.put("science", "Sciences");
        CANONICAL_CATEGORY_NAMES.put("policier", "Policier / Thriller");
        CANONICAL_CATEGORY_NAMES.put("thriller", "Policier / Thriller");
        CANONICAL_CATEGORY_NAMES.put("romance", "Romance");
        CANONICAL_CATEGORY_NAMES.put("fantasy", "Fantasy");
        CANONICAL_CATEGORY_NAMES.put("science fiction", "Science-Fiction");
        CANONICAL_CATEGORY_NAMES.put("histoire", "Histoire");
        CANONICAL_CATEGORY_NAMES.put("philosophie", "Philosophie");
        CANONICAL_CATEGORY_NAMES.put("business", "Économie");
        CANONICAL_CATEGORY_NAMES.put("psychologie", "Psychologie");
        CANONICAL_CATEGORY_NAMES.put("art", "Art / Photographie");
        CANONICAL_CATEGORY_NAMES.put("biographie", "Biographie / Autobiographie");
        CANONICAL_CATEGORY_NAMES.put("aventure", "Aventure");
        CANONICAL_CATEGORY_NAMES.put("spiritualite", "Religion et Spiritualité");
        CANONICAL_CATEGORY_NAMES.put("young-adult", "Young Adult");
        CANONICAL_CATEGORY_NAMES.put("classique", "Littérature Classique");
        CANONICAL_CATEGORY_NAMES.put("horreur", "Horreur / Épouvante");
        CANONICAL_CATEGORY_NAMES.put("poesie", "Poésie");
        CANONICAL_CATEGORY_NAMES.put("manga", "Bande Dessinée / Manga");
        CANONICAL_CATEGORY_NAMES.put("gastronomie", "Cuisine");
                CANONICAL_CATEGORY_NAMES.put("roman historique", "Roman Historique");
                CANONICAL_CATEGORY_NAMES.put("conte et legende", "Conte et Légende");
                CANONICAL_CATEGORY_NAMES.put("essai", "Essai");
                CANONICAL_CATEGORY_NAMES.put("developpement personnel", "Développement Personnel");
                CANONICAL_CATEGORY_NAMES.put("theatre", "Théâtre");
                CANONICAL_CATEGORY_NAMES.put("voyage", "Voyage");
    }

    /**
     * Mapper les subjects d'Open Library vers les thématiques françaises
     * 
     * @param openLibrarySubjects Liste des subjects de Open Library
     * @return Thématique française la plus pertinente, ou null si aucune
     *         correspondance
     */
    public String mapToFrenchCategory(List<String> openLibrarySubjects) {
        if (openLibrarySubjects == null || openLibrarySubjects.isEmpty()) {
            return null;
        }

        // Normaliser les subjects
        Set<String> normalizedSubjects = openLibrarySubjects.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        // Compter les correspondances pour chaque catégorie
        Map<String, Integer> categoryScores = new HashMap<>();

        for (Map.Entry<String, Set<String>> entry : CATEGORY_MAPPING.entrySet()) {
            String category = entry.getKey();
            Set<String> keywords = entry.getValue();

            int score = 0;
            for (String subject : normalizedSubjects) {
                for (String keyword : keywords) {
                    if (subject.contains(keyword) || keyword.contains(subject)) {
                        score++;
                    }
                }
            }

            if (score > 0) {
                categoryScores.put(category, score);
            }
        }

        // Retourner la catégorie avec le meilleur score
        return categoryScores.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .map(this::toCanonicalCategory)
                .orElse(null);
    }

    /**
     * Obtenir toutes les catégories possibles pour un ensemble de subjects
     * 
     * @param openLibrarySubjects Liste des subjects de Open Library
     * @param topN                Nombre maximum de catégories à retourner
     * @return Liste des catégories françaises triées par pertinence
     */
    public List<String> mapToMultipleCategories(List<String> openLibrarySubjects, int topN) {
        if (openLibrarySubjects == null || openLibrarySubjects.isEmpty()) {
            return Collections.emptyList();
        }

        Set<String> normalizedSubjects = openLibrarySubjects.stream()
                .map(String::toLowerCase)
                .map(String::trim)
                .collect(Collectors.toSet());

        Map<String, Integer> categoryScores = new HashMap<>();

        for (Map.Entry<String, Set<String>> entry : CATEGORY_MAPPING.entrySet()) {
            String category = entry.getKey();
            Set<String> keywords = entry.getValue();

            int score = 0;
            for (String subject : normalizedSubjects) {
                for (String keyword : keywords) {
                    if (subject.contains(keyword) || keyword.contains(subject)) {
                        score++;
                    }
                }
            }

            if (score > 0) {
                categoryScores.put(category, score);
            }
        }

        return categoryScores.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(topN)
                .map(Map.Entry::getKey)
                                .map(this::toCanonicalCategory)
                                .distinct()
                .collect(Collectors.toList());
    }

        private String toCanonicalCategory(String mappedCategory) {
                return CANONICAL_CATEGORY_NAMES.getOrDefault(mappedCategory, mappedCategory);
        }
}
