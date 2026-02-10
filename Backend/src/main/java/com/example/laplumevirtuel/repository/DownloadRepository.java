package com.example.laplumevirtuel.repository;

import com.example.laplumevirtuel.entities.Download;
import com.example.laplumevirtuel.entities.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DownloadRepository extends JpaRepository<Download, Long> {

    /**
     * Count downloads for a user in a specific month
     * @param user The user
     * @param downloadMonth The month (format: YYYYMM)
     * @return Number of downloads
     */
    Long countByUserAndDownloadMonth(Utilisateur user, Integer downloadMonth);

    /**
     * Get all downloads for a user in a specific month
     * @param user The user
     * @param downloadMonth The month (format: YYYYMM)
     * @return List of downloads
     */
    List<Download> findByUserAndDownloadMonthOrderByDownloadDateDesc(Utilisateur user, Integer downloadMonth);

    /**
     * Get all downloads for a user
     * @param user The user
     * @return List of downloads
     */
    List<Download> findByUserOrderByDownloadDateDesc(Utilisateur user);
}
