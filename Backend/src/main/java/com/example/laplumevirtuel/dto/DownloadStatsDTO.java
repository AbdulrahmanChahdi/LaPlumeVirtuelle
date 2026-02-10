package com.example.laplumevirtuel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DownloadStatsDTO {
    private boolean isSubscriber;
    private int remainingDownloads;
    private int totalDownloadsThisMonth;
    private int maxDownloadsPerMonth;
}
