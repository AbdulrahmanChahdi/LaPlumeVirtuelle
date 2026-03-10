package com.example.laplumevirtuel.controller;

import com.example.laplumevirtuel.dto.ReadingProgressDTO;
import com.example.laplumevirtuel.entities.Livre;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.LivreRepository;
import com.example.laplumevirtuel.repository.UtilisateurRepository;
import com.example.laplumevirtuel.service.ReadingProgressService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for managing book reading progress
 */
@RestController
@RequestMapping("/api/reading-progress")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173", "http://localhost:5174"})
@Slf4j
public class ReadingProgressController {

    private final ReadingProgressService readingProgressService;
    private final LivreRepository livreRepository;
    private final UtilisateurRepository utilisateurRepository;

    public ReadingProgressController(ReadingProgressService readingProgressService, 
                                    LivreRepository livreRepository,
                                    UtilisateurRepository utilisateurRepository) {
        this.readingProgressService = readingProgressService;
        this.livreRepository = livreRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    /**
     * Get reading progress for a specific book
     */
    @GetMapping("/book/{bookId}")
    public ResponseEntity<ReadingProgressDTO> getProgress(
            @PathVariable Long bookId,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = (String) authentication.getPrincipal();
        Utilisateur user = utilisateurRepository.findByAdresseMail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Livre book = livreRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        ReadingProgressDTO progress = readingProgressService.getOrCreateProgress(user, book);
        log.info("Reading progress retrieved for user {} - book {}", user.getAdresseMail(), book.getTitre());

        return ResponseEntity.ok(progress);
    }

    /**
     * Update reading progress for a book
     */
    @PostMapping("/book/{bookId}")
    public ResponseEntity<ReadingProgressDTO> updateProgress(
            @PathVariable Long bookId,
            @RequestParam Integer currentPage,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = (String) authentication.getPrincipal();
        Utilisateur user = utilisateurRepository.findByAdresseMail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Livre book = livreRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        ReadingProgressDTO progress = readingProgressService.updateProgress(user, book, currentPage);
        return ResponseEntity.ok(progress);
    }

    /**
     * Mark a book as finished
     */
    @PostMapping("/book/{bookId}/finish")
    public ResponseEntity<ReadingProgressDTO> finishBook(
            @PathVariable Long bookId,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = (String) authentication.getPrincipal();
        Utilisateur user = utilisateurRepository.findByAdresseMail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Livre book = livreRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        ReadingProgressDTO progress = readingProgressService.finishBook(user, book);
        log.info("Book marked as finished for user {} - book {}", user.getAdresseMail(), book.getTitre());

        return ResponseEntity.ok(progress);
    }

    /**
     * Get all reading progress for authenticated user
     */
    @GetMapping("/all")
    public ResponseEntity<List<ReadingProgressDTO>> getAllProgress(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = (String) authentication.getPrincipal();
        Utilisateur user = utilisateurRepository.findByAdresseMail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        List<ReadingProgressDTO> progress = readingProgressService.getAllProgress(user);

        return ResponseEntity.ok(progress);
    }

    /**
     * Get unfinished books for authenticated user
     */
    @GetMapping("/unfinished")
    public ResponseEntity<List<ReadingProgressDTO>> getUnfinishedBooks(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = (String) authentication.getPrincipal();
        Utilisateur user = utilisateurRepository.findByAdresseMail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        List<ReadingProgressDTO> progress = readingProgressService.getUnfinishedBooks(user);

        return ResponseEntity.ok(progress);
    }

    /**
     * Get finished books for authenticated user
     */
    @GetMapping("/finished")
    public ResponseEntity<List<ReadingProgressDTO>> getFinishedBooks(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = (String) authentication.getPrincipal();
        Utilisateur user = utilisateurRepository.findByAdresseMail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        List<ReadingProgressDTO> progress = readingProgressService.getFinishedBooks(user);

        return ResponseEntity.ok(progress);
    }
}
