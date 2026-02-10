package com.example.laplumevirtuel.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "downloads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Download {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Utilisateur user;

    @Column(name = "external_book_id", nullable = false)
    private String externalBookId;

    @Column(name = "book_title")
    private String bookTitle;

    @Column(name = "download_date", nullable = false)
    private LocalDateTime downloadDate;

    @Column(name = "download_month", nullable = false)
    private Integer downloadMonth; // Format: YYYYMM (ex: 202601 pour janvier 2026)

    @PrePersist
    protected void onCreate() {
        downloadDate = LocalDateTime.now();
        downloadMonth = Integer.parseInt(
            String.format("%d%02d", 
                downloadDate.getYear(), 
                downloadDate.getMonthValue())
        );
    }
}
