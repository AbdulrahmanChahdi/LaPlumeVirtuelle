package com.example.laplumevirtuel.service;

import com.example.laplumevirtuel.dto.BookSearchResultDTO;
import com.example.laplumevirtuel.dto.OpenLibraryResponse;
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
 * Service for integrating with external books API (Open Library)
 */
@Service
@Slf4j
public class ExternalBookService {

    @Value("${openlibrary.api.url:https://openlibrary.org/search.json}")
    private String openLibraryApiUrl;

    private final RestTemplate restTemplate;
    private final CategoryMappingService categoryMappingService;

    public ExternalBookService(RestTemplate restTemplate, CategoryMappingService categoryMappingService) {
        this.restTemplate = restTemplate;
        this.categoryMappingService = categoryMappingService;
    }

    /**
     * Search books from Open Library API
     *
     * @param query      Search query (title, author, keyword)
     * @param maxResults Maximum number of results (default: 20, max: 100)
     * @return List of book search results in unified format
     */
    public List<BookSearchResultDTO> searchBooks(String query, Integer maxResults) {
        if (query == null || query.trim().isEmpty()) {
            log.warn("Empty search query provided");
            return Collections.emptyList();
        }

        int limit = (maxResults != null && maxResults > 0 && maxResults <= 100) ? maxResults : 20;

        try {
            String url = buildSearchUrl(query, limit);
            log.info("Calling Open Library API: {}", url);

            OpenLibraryResponse response = restTemplate.getForObject(url, OpenLibraryResponse.class);

            if (response == null || response.getDocs() == null || response.getDocs().isEmpty()) {
                log.info("No books found for query: {}", query);
                return Collections.emptyList();
            }

            log.info("Found {} books for query: {}", response.getDocs().size(), query);
            return response.getDocs().stream()
                    .map(this::mapToBookSearchResult)
                    .filter(book -> book != null)
                    .collect(Collectors.toList());

        } catch (RestClientException e) {
            log.error("Error calling Open Library API for query '{}': {}", query, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    /**
     * Get book details by external ID (Open Library work key)
     *
     * @param externalId Open Library work key (e.g., "/works/OL45883W")
     * @return Book search result DTO or null if not found
     */
    public BookSearchResultDTO getBookById(String externalId) {
        if (externalId == null || externalId.trim().isEmpty()) {
            log.warn("Empty external ID provided");
            return null;
        }

        try {
            // Open Library work API: https://openlibrary.org/works/{key}.json
            String workId = externalId.replace("/works/", "");
            String url = "https://openlibrary.org/search.json?q=key:/works/" + workId;
            log.info("Fetching book details from Open Library API: {}", url);

            OpenLibraryResponse response = restTemplate.getForObject(url, OpenLibraryResponse.class);

            if (response == null || response.getDocs() == null || response.getDocs().isEmpty()) {
                log.info("No book found for ID: {}", externalId);
                return null;
            }

            return mapToBookSearchResult(response.getDocs().get(0));

        } catch (RestClientException e) {
            log.error("Error fetching book details for ID '{}': {}", externalId, e.getMessage(), e);
            return null; // Graceful fallback
        }
    }

    /**
     * Build search URL with query parameters for Open Library
     */
    private String buildSearchUrl(String query, int maxResults) {
        return UriComponentsBuilder.fromHttpUrl(openLibraryApiUrl)
                .queryParam("q", query)
                .queryParam("limit", maxResults)
                .queryParam("fields",
                        "key,title,author_name,first_publish_year,isbn,publisher,subject,language,cover_i,number_of_pages_median,first_sentence,publish_date")
                .toUriString();
    }

    /**
     * Map Open Library response to internal DTO
     */
    private BookSearchResultDTO mapToBookSearchResult(OpenLibraryResponse.OpenLibraryBook book) {
        if (book == null || book.getTitle() == null) {
            return null;
        }

        String isbn = extractIsbn(book.getIsbn());
        String coverUrl = extractCoverUrl(book.getCoverId());
        String category = categoryMappingService.mapToFrenchCategory(book.getSubject());
        String publishedDate = extractPublishedDate(book.getFirstPublishYear(), book.getPublishDate());
        String publisher = extractFirstPublisher(book.getPublisher());
        String language = extractPreferredLanguage(book.getLanguage());

        return BookSearchResultDTO.builder()
                .externalId(book.getKey())
                .title(book.getTitle())
                .authors(book.getAuthorName() != null ? book.getAuthorName() : new ArrayList<>())
                .description(extractDescription(book.getFirstSentence()))
                .coverUrl(coverUrl)
                .category(category)
                .publisher(publisher)
                .publishedDate(publishedDate)
                .pageCount(book.getNumberOfPages())
                .isbn(isbn)
                .language(language)
                .build();
    }

    /**
     * Extract ISBN (prefer ISBN_13 over ISBN_10)
     */
    private String extractIsbn(List<String> isbns) {
        if (isbns == null || isbns.isEmpty()) {
            return null;
        }

        // Prefer ISBN-13 (13 digits)
        return isbns.stream()
                .filter(isbn -> isbn != null && isbn.replaceAll("[^0-9]", "").length() == 13)
                .findFirst()
                .orElseGet(() -> isbns.stream()
                        .filter(isbn -> isbn != null && isbn.replaceAll("[^0-9]", "").length() == 10)
                        .findFirst()
                        .orElse(isbns.get(0)));
    }

    /**
     * Extract cover URL from Open Library cover ID
     * Open Library covers: https://covers.openlibrary.org/b/id/{cover_id}-L.jpg
     */
    private String extractCoverUrl(Long coverId) {
        if (coverId == null) {
            return null;
        }
        return String.format("https://covers.openlibrary.org/b/id/%d-L.jpg", coverId);
    }

    /**
     * Extract description from first sentence
     */
    private String extractDescription(List<String> firstSentence) {
        if (firstSentence == null || firstSentence.isEmpty()) {
            return null;
        }
        return firstSentence.get(0);
    }

    /**
     * Extract published date (prefer specific date over year)
     */
    private String extractPublishedDate(Integer firstPublishYear, List<String> publishDate) {
        if (publishDate != null && !publishDate.isEmpty()) {
            return publishDate.get(0);
        }
        if (firstPublishYear != null) {
            return String.valueOf(firstPublishYear);
        }
        return null;
    }

    /**
     * Extract first publisher
     */
    private String extractFirstPublisher(List<String> publishers) {
        if (publishers == null || publishers.isEmpty()) {
            return null;
        }
        return publishers.get(0);
    }

    /**
     * Extract preferred language (French > English > other)
     */
    private String extractPreferredLanguage(List<String> languages) {
        if (languages == null || languages.isEmpty()) {
            return null;
        }

        // Prefer French
        if (languages.contains("fre") || languages.contains("fr")) {
            return "fr";
        }

        // Then English
        if (languages.contains("eng") || languages.contains("en")) {
            return "en";
        }

        // Return first available
        return languages.get(0);
    }
}
