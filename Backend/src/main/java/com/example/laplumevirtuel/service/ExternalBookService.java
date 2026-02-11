package com.example.laplumevirtuel.service;

import com.example.laplumevirtuel.dto.BookSearchResultDTO;
import com.example.laplumevirtuel.dto.ExternalBookDTO;
import com.example.laplumevirtuel.dto.GoogleBooksResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for integrating with external books API (Google Books)
 */
@Service
@Slf4j
public class ExternalBookService {

    @Value("${google.books.api.url:https://www.googleapis.com/books/v1/volumes}")
    private String googleBooksApiUrl;

    @Value("${google.books.api.key:}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public ExternalBookService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Search books from Google Books API
     *
     * @param query Search query (title, author, keyword)
     * @param maxResults Maximum number of results (default: 20, max: 40)
     * @return List of book search results in unified format
     */
    public List<BookSearchResultDTO> searchBooks(String query, Integer maxResults) {
        if (query == null || query.trim().isEmpty()) {
            log.warn("Empty search query provided");
            return Collections.emptyList();
        }

        int limit = (maxResults != null && maxResults > 0 && maxResults <= 40) ? maxResults : 20;

        try {
            String url = buildSearchUrl(query, limit);
            log.info("Calling Google Books API: {}", url);

            GoogleBooksResponse response = restTemplate.getForObject(url, GoogleBooksResponse.class);

            if (response == null || response.getItems() == null || response.getItems().isEmpty()) {
                log.info("No books found for query: {}", query);
                return Collections.emptyList();
            }

            log.info("Found {} books for query: {}", response.getItems().size(), query);
            return response.getItems().stream()
                    .map(this::mapToBookSearchResult)
                    .filter(book -> book != null)
                    .collect(Collectors.toList());

        } catch (RestClientException e) {
            log.error("Error calling Google Books API for query '{}': {}", query, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Get book details by external ID
     *
     * @param externalId Google Books volume ID
     * @return Book search result DTO or null if not found
     */
    public BookSearchResultDTO getBookById(String externalId) {
        if (externalId == null || externalId.trim().isEmpty()) {
            log.warn("Empty external ID provided");
            return null;
        }

        try {
            String url = buildBookDetailUrl(externalId);
            log.info("Fetching book details from Google Books API: {}", url);

            ExternalBookDTO book = restTemplate.getForObject(url, ExternalBookDTO.class);

            if (book == null) {
                log.info("No book found for ID: {}", externalId);
                return null;
            }

            return mapToBookSearchResult(book);

        } catch (RestClientException e) {
            log.error("Error fetching book details for ID '{}': {}", externalId, e.getMessage(), e);
            return null; // Graceful fallback
        }
    }

    /**
     * Build search URL with query parameters
     */
    private String buildSearchUrl(String query, int maxResults) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(googleBooksApiUrl)
                .queryParam("q", query)
                .queryParam("maxResults", maxResults)
                .queryParam("printType", "books");
                // Removed langRestrict to allow books in all languages

        if (apiKey != null && !apiKey.isEmpty()) {
            builder.queryParam("key", apiKey);
        }

        return builder.toUriString();
    }

    /**
     * Build book detail URL
     */
    private String buildBookDetailUrl(String externalId) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(googleBooksApiUrl + "/" + externalId);

        if (apiKey != null && !apiKey.isEmpty()) {
            builder.queryParam("key", apiKey);
        }

        return builder.toUriString();
    }

    /**
     * Map external API response to internal DTO
     */
    private BookSearchResultDTO mapToBookSearchResult(ExternalBookDTO externalBook) {
        ExternalBookDTO.VolumeInfo info = externalBook.getVolumeInfo();

        if (info == null) {
            return null;
        }

        String isbn = extractIsbn(info.getIndustryIdentifiers());
        String coverUrl = extractCoverUrl(info.getImageLinks());
        String category = extractFirstCategory(info.getCategories());

        return BookSearchResultDTO.builder()
                .externalId(externalBook.getId())
                .title(info.getTitle())
                .authors(info.getAuthors() != null ? info.getAuthors() : new ArrayList<>())
                .description(info.getDescription())
                .coverUrl(coverUrl)
                .category(category)
                .publisher(info.getPublisher())
                .publishedDate(info.getPublishedDate())
                .pageCount(info.getPageCount())
                .isbn(isbn)
                .language(info.getLanguage())
                .build();
    }

    /**
     * Extract ISBN (prefer ISBN_13 over ISBN_10)
     */
    private String extractIsbn(List<ExternalBookDTO.IndustryIdentifier> identifiers) {
        if (identifiers == null || identifiers.isEmpty()) {
            return null;
        }

        return identifiers.stream()
                .filter(id -> "ISBN_13".equals(id.getType()))
                .map(ExternalBookDTO.IndustryIdentifier::getIdentifier)
                .findFirst()
                .orElseGet(() -> identifiers.stream()
                        .filter(id -> "ISBN_10".equals(id.getType()))
                        .map(ExternalBookDTO.IndustryIdentifier::getIdentifier)
                        .findFirst()
                        .orElse(null));
    }

    /**
     * Extract cover URL (prefer thumbnail)
     * Filter out invalid/placeholder images from Google Books
     */
    private String extractCoverUrl(ExternalBookDTO.ImageLinks imageLinks) {
        if (imageLinks == null) {
            return null;
        }

        String thumbnail = imageLinks.getThumbnail();
        if (thumbnail != null && !thumbnail.isEmpty() && isValidCoverUrl(thumbnail)) {
            // Replace http with https for security
            return thumbnail.replace("http://", "https://");
        }

        String smallThumbnail = imageLinks.getSmallThumbnail();
        if (smallThumbnail != null && !smallThumbnail.isEmpty() && isValidCoverUrl(smallThumbnail)) {
            return smallThumbnail.replace("http://", "https://");
        }

        return null;
    }

    /**
     * Check if cover URL is valid (not a placeholder/error image)
     */
    private boolean isValidCoverUrl(String url) {
        if (url == null || url.isEmpty()) {
            return false;
        }
        
        // Filter out common placeholder/error images
        String lowerUrl = url.toLowerCase();
        return !lowerUrl.contains("books-covers-images") 
            && !lowerUrl.contains("no-cover")
            && !lowerUrl.contains("image_not_available")
            && !lowerUrl.contains("default-cover");
    }

    /**
     * Extract first category
     */
    private String extractFirstCategory(List<String> categories) {
        if (categories == null || categories.isEmpty()) {
            return null;
        }
        return categories.get(0);
    }
}
