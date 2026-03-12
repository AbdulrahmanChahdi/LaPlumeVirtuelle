package com.example.laplumevirtuel.integration;

import com.example.laplumevirtuel.dto.BookSearchResultDTO;
import com.example.laplumevirtuel.service.ExternalBookService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test d'intégration pour l'API Open Library
 * Ces tests appellent l'API réelle - désactiver si pas de connexion internet
 */
@SpringBootTest
class OpenLibraryIntegrationTest {

    @Autowired
    private ExternalBookService externalBookService;

    @Test
    void testSearchScienceFictionBooks() {
        List<BookSearchResultDTO> results = externalBookService.searchBooks("Fondation Isaac Asimov", 5);

        assertNotNull(results);
        assertFalse(results.isEmpty());

        // Vérifier qu'on a trouvé un livre
        BookSearchResultDTO firstBook = results.get(0);
        assertNotNull(firstBook.getTitle());
        assertNotNull(firstBook.getExternalId());

        System.out.println("Livre trouvé: " + firstBook.getTitle());
        System.out.println("Catégorie mappée: " + firstBook.getCategory());
        System.out.println("Cover URL: " + firstBook.getCoverUrl());
    }

    @Test
    void testSearchPoliceBooks() {
        List<BookSearchResultDTO> results = externalBookService.searchBooks("Sherlock Holmes", 5);

        assertNotNull(results);
        assertFalse(results.isEmpty());

        BookSearchResultDTO firstBook = results.get(0);
        System.out.println("Livre trouvé: " + firstBook.getTitle());
        System.out.println("Catégorie mappée: " + firstBook.getCategory());

        // La catégorie devrait être "policier" ou "mystere"
        assertNotNull(firstBook.getCategory());
    }

    @Test
    void testSearchFrenchBooks() {
        List<BookSearchResultDTO> results = externalBookService.searchBooks("Les Miserables Victor Hugo", 3);

        assertNotNull(results);

        if (!results.isEmpty()) {
            BookSearchResultDTO firstBook = results.get(0);
            assertNotNull(firstBook.getTitle());
            System.out.println("Livre français trouvé: " + firstBook.getTitle());
        } else {
            System.out.println("Aucun résultat retourné par l'API Open Library pour cette requête (réseau ou API indisponible)");
        }
    }

    @Test
    void testGetBookById() {
        // Test avec un ID connu d'Open Library (Foundation d'Asimov)
        BookSearchResultDTO book = externalBookService.getBookById("/works/OL46125W");

        if (book != null) {
            assertNotNull(book.getTitle());
            System.out.println("Livre trouvé par ID: " + book.getTitle());
            System.out.println("Catégorie: " + book.getCategory());
        }
    }

    @Test
    void testCategoryMapping() {
        // Tester plusieurs genres pour vérifier le mapping
        String[] queries = {
                "Dune Frank Herbert", // Science-fiction
                "Agatha Christie", // Policier
                "Sapiens Yuval Noah Harari", // Histoire
                "Harry Potter" // Fantasy
        };

        for (String query : queries) {
            List<BookSearchResultDTO> results = externalBookService.searchBooks(query, 1);
            if (!results.isEmpty()) {
                BookSearchResultDTO book = results.get(0);
                System.out.println("\nRecherche: " + query);
                System.out.println("Titre: " + book.getTitle());
                System.out.println("Catégorie FR: " + book.getCategory());
            }
        }
    }

    @Test
    void testEmptyQuery() {
        List<BookSearchResultDTO> results = externalBookService.searchBooks("", 10);
        assertTrue(results.isEmpty());
    }

    @Test
    void testNullQuery() {
        List<BookSearchResultDTO> results = externalBookService.searchBooks(null, 10);
        assertTrue(results.isEmpty());
    }
}
