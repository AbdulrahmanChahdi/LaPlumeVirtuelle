package com.example.laplumevirtuel.controller;

import com.example.laplumevirtuel.dto.BookSearchResultDTO;
import com.example.laplumevirtuel.service.ExternalBookService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for public book search using external API
 */
@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
@Slf4j
public class BookSearchController {

    private final ExternalBookService externalBookService;

    public BookSearchController(ExternalBookService externalBookService) {
        this.externalBookService = externalBookService;
    }

    /**
     * Public endpoint for searching books
     * No authentication required
     *
     * @param query Search query (title, author, keyword)
     * @param maxResults Maximum number of results (optional, default: 20, max: 40)
     * @return List of book search results
     */
    @GetMapping("/search")
    public ResponseEntity<List<BookSearchResultDTO>> searchBooks(
            @RequestParam String query,
            @RequestParam(required = false, defaultValue = "20") Integer maxResults
    ) {
        log.info("Public book search request - query: '{}', maxResults: {}", query, maxResults);

        if (query == null || query.trim().isEmpty()) {
            log.warn("Empty search query provided");
            return ResponseEntity.badRequest().build();
        }

        List<BookSearchResultDTO> results = externalBookService.searchBooks(query, maxResults);
        
        log.info("Returning {} search results for query: '{}'", results.size(), query);
        return ResponseEntity.ok(results);
    }

    /**
     * Advanced search endpoint with filters
     * No authentication required
     *
     * @param author Author name (optional)
     * @param subject Genre/category (optional)
     * @param keyword General keyword (optional)
     * @param maxResults Maximum number of results (optional, default: 20, max: 40)
     * @return List of book search results
     */
    @GetMapping("/search/advanced")
    public ResponseEntity<List<BookSearchResultDTO>> advancedSearch(
            @RequestParam(required = false) String author,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false, defaultValue = "20") Integer maxResults
    ) {
        log.info("Advanced search - author: '{}', subject: '{}', keyword: '{}', maxResults: {}",
                author, subject, keyword, maxResults);

        // Build Google Books API query with special operators
        StringBuilder queryBuilder = new StringBuilder();
        
        if (author != null && !author.trim().isEmpty()) {
            queryBuilder.append("inauthor:").append(author.trim()).append(" ");
        }
        if (subject != null && !subject.trim().isEmpty()) {
            queryBuilder.append("subject:").append(subject.trim()).append(" ");
        }
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryBuilder.append(keyword.trim()).append(" ");
        }

        String finalQuery = queryBuilder.toString().trim();
        
        if (finalQuery.isEmpty()) {
            log.warn("No search criteria provided for advanced search");
            return ResponseEntity.badRequest().build();
        }

        log.info("Final Google Books query: '{}'", finalQuery);
        List<BookSearchResultDTO> results = externalBookService.searchBooks(finalQuery, maxResults);
        
        log.info("Returning {} results for advanced search", results.size());
        return ResponseEntity.ok(results);
    }

    /**
     * Get book details by external ID
     * No authentication required for preview
     *
     * @param externalId Google Books volume ID
     * @return Book details
     */
    @GetMapping("/external/{externalId}")
    public ResponseEntity<BookSearchResultDTO> getBookByExternalId(@PathVariable String externalId) {
        log.info("Get book by external ID: {}", externalId);

        BookSearchResultDTO book = externalBookService.getBookById(externalId);

        if (book == null) {
            log.warn("Book not found for external ID: {}", externalId);
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(book);
    }
}
