package com.example.laplumevirtuel.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

/**
 * DTO for Google Books API search response
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GoogleBooksResponse {
    
    private String kind;
    private Integer totalItems;
    private List<ExternalBookDTO> items;
}
