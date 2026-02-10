package com.example.laplumevirtuel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Internal DTO for book search results
 * Unified format for external API data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookSearchResultDTO {
    
    private String externalId;
    private String title;
    private List<String> authors;
    private String description;
    private String coverUrl;
    private String category;
    private String publisher;
    private String publishedDate;
    private Integer pageCount;
    private String isbn;
    private String language;
}
