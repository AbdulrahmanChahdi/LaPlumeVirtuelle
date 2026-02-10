package com.example.laplumevirtuel.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * DTO for Google Books API response
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalBookDTO {
    
    private String id;
    
    @JsonProperty("volumeInfo")
    private VolumeInfo volumeInfo;
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class VolumeInfo {
        private String title;
        private List<String> authors;
        private String publisher;
        private String publishedDate;
        private String description;
        
        @JsonProperty("pageCount")
        private Integer pageCount;
        
        private List<String> categories;
        
        @JsonProperty("imageLinks")
        private ImageLinks imageLinks;
        
        private String language;
        
        @JsonProperty("industryIdentifiers")
        private List<IndustryIdentifier> industryIdentifiers;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImageLinks {
        private String thumbnail;
        private String smallThumbnail;
    }
    
    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class IndustryIdentifier {
        private String type; // ISBN_10, ISBN_13
        private String identifier;
    }
}
