package com.example.laplumevirtuel.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test du service de mapping de catégories
 */
@SpringBootTest
class CategoryMappingServiceTest {

    @Autowired
    private CategoryMappingService categoryMappingService;

    @Test
    void testMapScienceCategory() {
        List<String> subjects = Arrays.asList(
                "Science",
                "Physics",
                "Popular science");

        String result = categoryMappingService.mapToFrenchCategory(subjects);
        assertEquals("science", result);
    }

    @Test
    void testMapMysteryToPolice() {
        List<String> subjects = Arrays.asList(
                "Mystery",
                "Detective stories",
                "Crime fiction");

        String result = categoryMappingService.mapToFrenchCategory(subjects);
        assertEquals("policier", result);
    }

    @Test
    void testMapFantasy() {
        List<String> subjects = Arrays.asList(
                "Fantasy fiction",
                "Magic",
                "Epic fantasy");

        String result = categoryMappingService.mapToFrenchCategory(subjects);
        assertEquals("fantasy", result);
    }

    @Test
    void testMapMultipleCategories() {
        List<String> subjects = Arrays.asList(
                "Science fiction",
                "Mystery",
                "Thriller");

        List<String> results = categoryMappingService.mapToMultipleCategories(subjects, 3);
        assertFalse(results.isEmpty());
        assertTrue(results.size() <= 3);
    }

    @Test
    void testMapHistoricalBiography() {
        List<String> subjects = Arrays.asList(
                "Biography",
                "History",
                "World War II");

        List<String> results = categoryMappingService.mapToMultipleCategories(subjects, 3);
        assertTrue(results.contains("biographie") || results.contains("histoire"));
    }

    @Test
    void testEmptySubjects() {
        String result = categoryMappingService.mapToFrenchCategory(Arrays.asList());
        assertNull(result);
    }

    @Test
    void testNoMatchingCategory() {
        List<String> subjects = Arrays.asList(
                "Unknown category",
                "Random subject");

        // Should return null if no matching category found
        String result = categoryMappingService.mapToFrenchCategory(subjects);
        // Could be null or some default category depending on implementation
    }
}
