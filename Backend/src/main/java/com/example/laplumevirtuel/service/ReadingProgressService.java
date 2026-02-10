package com.example.laplumevirtuel.service;

import com.example.laplumevirtuel.dto.ReadingProgressDTO;
import com.example.laplumevirtuel.entities.Livre;
import com.example.laplumevirtuel.entities.ReadingProgress;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.ReadingProgressRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ReadingProgressService {

    private final ReadingProgressRepository readingProgressRepository;

    public ReadingProgressService(ReadingProgressRepository readingProgressRepository) {
        this.readingProgressRepository = readingProgressRepository;
    }

    /**
     * Get or create reading progress for a user and book
     */
    public ReadingProgressDTO getOrCreateProgress(Utilisateur user, Livre book) {
        ReadingProgress progress = readingProgressRepository
                .findByUserAndBook(user, book)
                .orElseGet(() -> {
                    ReadingProgress newProgress = new ReadingProgress();
                    newProgress.setUser(user);
                    newProgress.setBook(book);
                    newProgress.setCurrentPage(0);
                    newProgress.setTotalPages(book.getNombreDePage());
                    return readingProgressRepository.save(newProgress);
                });

        return mapToDTO(progress);
    }

    /**
     * Update reading progress for a user and book
     */
    @Transactional
    public ReadingProgressDTO updateProgress(Utilisateur user, Livre book, Integer currentPage) {
        ReadingProgress progress = readingProgressRepository
                .findByUserAndBook(user, book)
                .orElseGet(() -> {
                    ReadingProgress newProgress = new ReadingProgress();
                    newProgress.setUser(user);
                    newProgress.setBook(book);
                    newProgress.setTotalPages(book.getNombreDePage());
                    return newProgress;
                });

        progress.setCurrentPage(Math.min(currentPage, book.getNombreDePage()));
        
        ReadingProgress updated = readingProgressRepository.save(progress);
        log.info("Reading progress updated for user {} - book {} - page {}/{}", 
                user.getAdresseMail(), book.getTitre(), updated.getCurrentPage(), updated.getTotalPages());

        return mapToDTO(updated);
    }

    /**
     * Mark a book as finished
     */
    @Transactional
    public ReadingProgressDTO finishBook(Utilisateur user, Livre book) {
        ReadingProgress progress = readingProgressRepository
                .findByUserAndBook(user, book)
                .orElseThrow(() -> new IllegalArgumentException("Reading progress not found"));

        progress.setCurrentPage(book.getNombreDePage());
        progress.setIsFinished(true);

        ReadingProgress updated = readingProgressRepository.save(progress);
        log.info("Book marked as finished for user {} - book {}", 
                user.getAdresseMail(), book.getTitre());

        return mapToDTO(updated);
    }

    /**
     * Get all reading progress for a user
     */
    public List<ReadingProgressDTO> getAllProgress(Utilisateur user) {
        return readingProgressRepository.findByUserOrderByLastReadAtDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get unfinished books for a user
     */
    public List<ReadingProgressDTO> getUnfinishedBooks(Utilisateur user) {
        return readingProgressRepository.findByUserAndIsFinishedFalseOrderByLastReadAtDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get finished books for a user
     */
    public List<ReadingProgressDTO> getFinishedBooks(Utilisateur user) {
        return readingProgressRepository.findByUserAndIsFinishedTrueOrderByFinishedAtDesc(user)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Map entity to DTO
     */
    private ReadingProgressDTO mapToDTO(ReadingProgress progress) {
        return ReadingProgressDTO.builder()
                .id(progress.getId())
                .currentPage(progress.getCurrentPage())
                .totalPages(progress.getTotalPages())
                .isFinished(progress.getIsFinished())
                .startedAt(progress.getStartedAt())
                .lastReadAt(progress.getLastReadAt())
                .finishedAt(progress.getFinishedAt())
                .build();
    }
}
