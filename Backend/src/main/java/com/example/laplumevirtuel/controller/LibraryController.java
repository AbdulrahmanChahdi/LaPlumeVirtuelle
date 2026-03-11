package com.example.laplumevirtuel.controller;

import com.example.laplumevirtuel.entities.Livre;
import com.example.laplumevirtuel.entities.LivreAudio;
import com.example.laplumevirtuel.entities.Podcast;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.LivreAudioRepository;
import com.example.laplumevirtuel.repository.LivreRepository;
import com.example.laplumevirtuel.repository.PodcastRepository;
import com.example.laplumevirtuel.repository.UtilisateurRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/library")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173", "http://localhost:5174"})
public class LibraryController {

    private final UtilisateurRepository utilisateurRepository;
    private final LivreRepository livreRepository;
    private final LivreAudioRepository livreAudioRepository;
    private final PodcastRepository podcastRepository;

    public LibraryController(UtilisateurRepository utilisateurRepository,
                             LivreRepository livreRepository,
                             LivreAudioRepository livreAudioRepository,
                             PodcastRepository podcastRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.livreRepository = livreRepository;
        this.livreAudioRepository = livreAudioRepository;
        this.podcastRepository = podcastRepository;
    }

    @GetMapping("/books")
    public ResponseEntity<List<Livre>> getMyBooks(Authentication authentication) {
        Utilisateur user = getAuthenticatedUser(authentication);
        Set<Livre> books = user.getLivresTelecharges();
        if (books == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(List.copyOf(books));
    }

    @GetMapping("/audiobooks")
    public ResponseEntity<List<LivreAudio>> getMyAudiobooks(Authentication authentication) {
        Utilisateur user = getAuthenticatedUser(authentication);
        Set<LivreAudio> audiobooks = user.getLivresAudiosEcouter();
        if (audiobooks == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(List.copyOf(audiobooks));
    }

    @GetMapping("/podcasts")
    public ResponseEntity<List<Podcast>> getMyPodcasts(Authentication authentication) {
        Utilisateur user = getAuthenticatedUser(authentication);
        Set<Podcast> podcasts = user.getPodcastsEcoutes();
        if (podcasts == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(List.copyOf(podcasts));
    }

    @PostMapping("/books/{bookId}")
    public ResponseEntity<Void> addBookToLibrary(@PathVariable Long bookId, Authentication authentication) {
        Utilisateur user = getAuthenticatedUser(authentication);
        Livre book = livreRepository.findById(bookId).orElseThrow(() -> new IllegalArgumentException("Livre introuvable"));

        Set<Livre> current = user.getLivresTelecharges() == null ? new HashSet<>() : new HashSet<>(user.getLivresTelecharges());
        current.add(book);
        user.setLivresTelecharges(current);
        utilisateurRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/books/{bookId}")
    public ResponseEntity<Void> removeBookFromLibrary(@PathVariable Long bookId, Authentication authentication) {
        Utilisateur user = getAuthenticatedUser(authentication);
        if (user.getLivresTelecharges() != null) {
            user.getLivresTelecharges().removeIf(book -> book.getId().equals(bookId));
            utilisateurRepository.save(user);
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/audiobooks/{audioId}")
    public ResponseEntity<Void> addAudiobookToLibrary(@PathVariable Long audioId, Authentication authentication) {
        Utilisateur user = getAuthenticatedUser(authentication);
        LivreAudio audiobook = livreAudioRepository.findById(audioId)
                .orElseThrow(() -> new IllegalArgumentException("Livre audio introuvable"));

        Set<LivreAudio> current = user.getLivresAudiosEcouter() == null
                ? new HashSet<>()
                : new HashSet<>(user.getLivresAudiosEcouter());
        current.add(audiobook);
        user.setLivresAudiosEcouter(current);
        utilisateurRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/audiobooks/{audioId}")
    public ResponseEntity<Void> removeAudiobookFromLibrary(@PathVariable Long audioId, Authentication authentication) {
        Utilisateur user = getAuthenticatedUser(authentication);
        if (user.getLivresAudiosEcouter() != null) {
            user.getLivresAudiosEcouter().removeIf(audio -> audio.getId().equals(audioId));
            utilisateurRepository.save(user);
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/podcasts/{podcastId}")
    public ResponseEntity<Void> addPodcastToLibrary(@PathVariable Long podcastId, Authentication authentication) {
        Utilisateur user = getAuthenticatedUser(authentication);
        Podcast podcast = podcastRepository.findById(podcastId)
                .orElseThrow(() -> new IllegalArgumentException("Podcast introuvable"));

        Set<Podcast> current = user.getPodcastsEcoutes() == null ? new HashSet<>() : new HashSet<>(user.getPodcastsEcoutes());
        current.add(podcast);
        user.setPodcastsEcoutes(current);
        utilisateurRepository.save(user);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/podcasts/{podcastId}")
    public ResponseEntity<Void> removePodcastFromLibrary(@PathVariable Long podcastId, Authentication authentication) {
        Utilisateur user = getAuthenticatedUser(authentication);
        if (user.getPodcastsEcoutes() != null) {
            user.getPodcastsEcoutes().removeIf(podcast -> podcast.getId().equals(podcastId));
            utilisateurRepository.save(user);
        }
        return ResponseEntity.noContent().build();
    }

    private Utilisateur getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new IllegalArgumentException("Utilisateur non authentifié");
        }
        String email = (String) authentication.getPrincipal();
        return utilisateurRepository.findByAdresseMail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
    }
}
