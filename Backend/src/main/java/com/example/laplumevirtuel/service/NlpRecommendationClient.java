package com.example.laplumevirtuel.service;

import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class NlpRecommendationClient {

    private final RestTemplate restTemplate;
    private final String nlpBaseUrl;

    public NlpRecommendationClient(
            RestTemplateBuilder restTemplateBuilder,
            @Value("${nlp.base-url:http://localhost:5001}") String nlpBaseUrl,
            @Value("${nlp.connect-timeout-ms:3000}") long connectTimeoutMs,
            @Value("${nlp.read-timeout-ms:10000}") long readTimeoutMs) {
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(connectTimeoutMs))
                .setReadTimeout(Duration.ofMillis(readTimeoutMs))
                .build();
        this.nlpBaseUrl = nlpBaseUrl;
    }

    public List<NlpRecommendationItem> fetchRecommendations(
            Long userId,
            List<String> formats,
            List<String> genres,
            String texteLibre,
            int limit) {

        String endpoint = nlpBaseUrl + "/nlp/recommend";

        Map<String, Object> payload = new HashMap<>();
        payload.put("userId", userId);
        payload.put("formats", formats);
        payload.put("genres", genres);
        payload.put("texteLibre", texteLibre);
        payload.put("limit", limit);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        try {
            ResponseEntity<NlpRecommendationResponse> response = restTemplate.postForEntity(
                    endpoint,
                    new HttpEntity<>(payload, headers),
                    NlpRecommendationResponse.class);

            NlpRecommendationResponse body = response.getBody();
            if (body == null || body.getRecommendations() == null) {
                return Collections.emptyList();
            }

            return body.getRecommendations();
        } catch (RestClientException e) {
            log.error("NLP service call failed at {}: {}", endpoint, e.getMessage(), e);
            return Collections.emptyList();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NlpRecommendationResponse {
        private List<NlpRecommendationItem> recommendations;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NlpRecommendationItem {
        private String id;
        private String type;
        private String title;
        private String author;
        private String coverUrl;
        private List<String> tags;
        private Double score;
    }
}
