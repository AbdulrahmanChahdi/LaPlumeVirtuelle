package com.example.laplumevirtuel.service;

import com.example.laplumevirtuel.dto.DownloadStatsDTO;
import com.example.laplumevirtuel.entities.Download;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.DownloadRepository;
import com.example.laplumevirtuel.repository.UtilisateurRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Slf4j
public class DownloadService {

    private static final int FREE_DOWNLOADS_PER_MONTH = 5;

    private final DownloadRepository downloadRepository;
    private final UtilisateurRepository utilisateurRepository;

    public DownloadService(DownloadRepository downloadRepository, UtilisateurRepository utilisateurRepository) {
        this.downloadRepository = downloadRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    /**
     * Get download statistics for a user by email
     * @param email The user email
     * @return Download statistics
     */
    public DownloadStatsDTO getDownloadStatsByEmail(String email) {
        Utilisateur user = utilisateurRepository.findByAdresseMail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return getDownloadStats(user);
    }

    /**
     * Get download statistics for a user
     * @param user The user
     * @return Download statistics
     */
    public DownloadStatsDTO getDownloadStats(Utilisateur user) {
        boolean isSubscriber = user.getAbonnements() != null && 
                user.getAbonnements().stream()
                    .anyMatch(a -> "ABONNE".equalsIgnoreCase(a.getType_abonnement()));
        int currentMonth = getCurrentMonth();
        
        Long downloadsThisMonth = downloadRepository.countByUserAndDownloadMonth(user, currentMonth);
        int totalDownloads = downloadsThisMonth != null ? downloadsThisMonth.intValue() : 0;
        
        int remaining = isSubscriber ? Integer.MAX_VALUE : Math.max(0, FREE_DOWNLOADS_PER_MONTH - totalDownloads);

        return DownloadStatsDTO.builder()
                .isSubscriber(isSubscriber)
                .remainingDownloads(remaining)
                .totalDownloadsThisMonth(totalDownloads)
                .maxDownloadsPerMonth(isSubscriber ? -1 : FREE_DOWNLOADS_PER_MONTH)
                .build();
    }

    /**
     * Check if user can download by email
     * @param email The user email
     * @return true if user can download
     */
    public boolean canDownloadByEmail(String email) {
        DownloadStatsDTO stats = getDownloadStatsByEmail(email);
        return stats.isSubscriber() || stats.getRemainingDownloads() > 0;
    }

    /**
     * Check if user can download
     * @param user The user
     * @return true if user can download
     */
    public boolean canDownload(Utilisateur user) {
        DownloadStatsDTO stats = getDownloadStats(user);
        return stats.isSubscriber() || stats.getRemainingDownloads() > 0;
    }

    /**
     * Record a download by email
     * @param email The user email
     * @param externalBookId The external book ID
     * @param bookTitle The book title
     * @return The recorded download
     */
    @Transactional
    public Download recordDownloadByEmail(String email, String externalBookId, String bookTitle) {
        Utilisateur user = utilisateurRepository.findByAdresseMail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));
        return recordDownload(user, externalBookId, bookTitle);
    }

    /**
     * Record a download
     * @param user The user
     * @param externalBookId The external book ID
     * @param bookTitle The book title
     * @return The recorded download
     */
    @Transactional
    public Download recordDownload(Utilisateur user, String externalBookId, String bookTitle) {
        if (!canDownload(user)) {
            throw new IllegalStateException("Download limit reached for this month");
        }

        Download download = new Download();
        download.setUser(user);
        download.setExternalBookId(externalBookId);
        download.setBookTitle(bookTitle);

        Download saved = downloadRepository.save(download);
        log.info("Download recorded for user {} - book: {} ({})", 
                user.getAdresseMail(), bookTitle, externalBookId);
        
        return saved;
    }

    /**
     * Get current month in format YYYYMM
     * @return Current month
     */
    private int getCurrentMonth() {
        LocalDateTime now = LocalDateTime.now();
        return Integer.parseInt(String.format("%d%02d", now.getYear(), now.getMonthValue()));
    }
}
