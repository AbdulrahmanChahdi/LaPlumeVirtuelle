package com.example.laplumevirtuel.controller;

import com.example.laplumevirtuel.dto.DownloadStatsDTO;
import com.example.laplumevirtuel.service.DownloadService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for managing book downloads
 */
@RestController
@RequestMapping("/api/downloads")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173", "http://localhost:5174"})
@Slf4j
public class DownloadController {

    private final DownloadService downloadService;

    public DownloadController(DownloadService downloadService) {
        this.downloadService = downloadService;
    }

    /**
     * Get download statistics for authenticated user
     * @param authentication Spring Security authentication
     * @return Download statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<DownloadStatsDTO> getDownloadStats(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            log.warn("Unauthorized access to download stats");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = (String) authentication.getPrincipal();
        DownloadStatsDTO stats = downloadService.getDownloadStatsByEmail(email);

        log.info("Download stats requested for user: {} - Subscriber: {}, Remaining: {}", 
                email, stats.isSubscriber(), stats.getRemainingDownloads());

        return ResponseEntity.ok(stats);
    }

    /**
     * Download a book (placeholder - actual download implementation needed)
     * @param externalId Google Books volume ID
     * @param authentication Spring Security authentication
     * @return Response indicating download status
     */
    @GetMapping("/book/{externalId}")
    public ResponseEntity<String> downloadBook(
            @PathVariable String externalId,
            Authentication authentication
    ) {
        if (authentication == null || authentication.getPrincipal() == null) {
            log.warn("Unauthorized download attempt for book: {}", externalId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }

        String email = (String) authentication.getPrincipal();

        if (!downloadService.canDownloadByEmail(email)) {
            log.warn("Download limit reached for user: {}", email);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Download limit reached for this month. Please upgrade to Premium for unlimited downloads.");
        }

        try {
            // TODO: Implement actual book download from Google Books or internal storage
            // For now, just record the download
            downloadService.recordDownloadByEmail(email, externalId, "Book Title - " + externalId);

            log.info("Download successful for user: {} - book: {}", email, externalId);
            
            return ResponseEntity.ok("Download recorded successfully. Actual file download to be implemented.");
        } catch (IllegalStateException e) {
            log.error("Download failed for user: {} - {}", email, e.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error during download for user: {} - {}", email, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred during download");
        }
    }
}
