package com.example.laplumevirtuel.document;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "onboarding_profiles")
public class OnboardingProfileDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private Long userId;

    private String ageRange;

    private List<String> objectives;

    private List<String> formats;

    private List<String> genres;

    private String readingLevel;

    private String sessionTime;

    private List<String> moments;

    private String discoveryPreference;

    private Boolean consent;

    private String favorites;

    private String tasteDescription;

    private String texteLibre;

    private Instant createdAt;

    private Instant updatedAt;
}
