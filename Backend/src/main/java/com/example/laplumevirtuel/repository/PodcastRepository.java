package com.example.laplumevirtuel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import com.example.laplumevirtuel.entities.Podcast;

public interface PodcastRepository extends JpaRepository<Podcast, Long> {
    
    @Query("SELECT p FROM Podcast p WHERE " +
           "LOWER(p.nom) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.theme) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.animateur) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Podcast> searchPodcasts(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT p FROM Podcast p WHERE LOWER(p.theme) = LOWER(:theme)")
    List<Podcast> findByTheme(@Param("theme") String theme);
    
    List<Podcast> findByDureeLessThanEqual(int dureeEnSecondes);
}
