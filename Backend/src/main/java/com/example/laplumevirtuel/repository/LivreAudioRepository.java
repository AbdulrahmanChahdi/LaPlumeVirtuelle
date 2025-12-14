package com.example.laplumevirtuel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

import com.example.laplumevirtuel.entities.LivreAudio;

public interface LivreAudioRepository extends JpaRepository<LivreAudio, Long> {
    
    @Query("SELECT la FROM LivreAudio la WHERE " +
           "LOWER(la.titre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(la.narrateur) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(la.livre.auteur.nom) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<LivreAudio> searchLivresAudio(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT la FROM LivreAudio la WHERE la.livre.categorie.id = :categorieId")
    List<LivreAudio> findByCategorie(@Param("categorieId") Long categorieId);
    
    @Query("SELECT la FROM LivreAudio la WHERE " +
           "CAST(SUBSTRING(la.duree, 1, LOCATE('h', la.duree) - 1) AS int) <= :heures")
    List<LivreAudio> findByDureeLessThanEqual(@Param("heures") int heures);
}
