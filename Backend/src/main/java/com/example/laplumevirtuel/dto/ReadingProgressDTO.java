package com.example.laplumevirtuel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReadingProgressDTO {
    private Long id;
    private Integer currentPage;
    private Integer totalPages;
    private Boolean isFinished;
    private LocalDateTime startedAt;
    private LocalDateTime lastReadAt;
    private LocalDateTime finishedAt;
    
    // Computed field
    public Integer getProgressPercentage() {
        if (totalPages == null || totalPages == 0) return 0;
        return Math.round((currentPage * 100f) / totalPages);
    }
}
