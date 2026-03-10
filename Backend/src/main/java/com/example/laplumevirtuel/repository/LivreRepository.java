package com.example.laplumevirtuel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.laplumevirtuel.entities.Livre;

import java.util.List;
import java.util.Optional;

public interface LivreRepository extends JpaRepository<Livre, Long> {

    /**
     * Find a book by its external API ID (Open Library work key)
     */
    Optional<Livre> findByExternalId(String externalId);

    /**
     * Search books by title, author name, or year
     */
    @Query("SELECT l FROM Livre l LEFT JOIN l.auteur a WHERE " +
            "LOWER(l.titre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(a.nom) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(l.anneeEdition) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Livre> searchByKeyword(@Param("keyword") String keyword);
}
