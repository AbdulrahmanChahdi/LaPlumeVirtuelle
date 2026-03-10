package com.example.laplumevirtuel.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

/**
 * DTO for Open Library API search response
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class OpenLibraryResponse {

    @JsonProperty("numFound")
    private Integer numFound;

    @JsonProperty("start")
    private Integer start;

    @JsonProperty("docs")
    private List<OpenLibraryBook> docs;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OpenLibraryBook {

        @JsonProperty("key")
        private String key; // e.g., "/works/OL45883W"

        @JsonProperty("title")
        private String title;

        @JsonProperty("author_name")
        private List<String> authorName;

        @JsonProperty("first_publish_year")
        private Integer firstPublishYear;

        @JsonProperty("isbn")
        private List<String> isbn;

        @JsonProperty("publisher")
        private List<String> publisher;

        @JsonProperty("subject")
        private List<String> subject;

        @JsonProperty("language")
        private List<String> language;

        @JsonProperty("cover_i")
        private Long coverId; // Cover image ID

        @JsonProperty("number_of_pages_median")
        private Integer numberOfPages;

        @JsonProperty("first_sentence")
        private List<String> firstSentence;

        @JsonProperty("publish_date")
        private List<String> publishDate;

        @JsonProperty("publish_year")
        private List<Integer> publishYear;
    }
}
