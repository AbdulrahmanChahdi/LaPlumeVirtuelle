package com.example.laplumevirtuel.repository;

import com.example.laplumevirtuel.entities.ReadingProgress;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.entities.Livre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReadingProgressRepository extends JpaRepository<ReadingProgress, Long> {

    /**
     * Get reading progress for a user and book
     */
    Optional<ReadingProgress> findByUserAndBook(Utilisateur user, Livre book);

    /**
     * Get all reading progress for a user, ordered by last read time
     */
    List<ReadingProgress> findByUserOrderByLastReadAtDesc(Utilisateur user);

    /**
     * Get all unfinished books for a user
     */
    List<ReadingProgress> findByUserAndIsFinishedFalseOrderByLastReadAtDesc(Utilisateur user);

    /**
     * Get all finished books for a user
     */
    List<ReadingProgress> findByUserAndIsFinishedTrueOrderByFinishedAtDesc(Utilisateur user);
}
