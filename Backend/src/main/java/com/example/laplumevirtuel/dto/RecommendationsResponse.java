package com.example.laplumevirtuel.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationsResponse {

    private Long userId;
    private List<RecommendationCard> recommendations;
    private Integer total;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendationCard {
        private String id;
        private String type;
        private String title;
        private String author;
        private String coverUrl;
        private List<String> tags;
        private Double score;
        private Boolean favorite;
    }
}
