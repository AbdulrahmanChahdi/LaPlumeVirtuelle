package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Podcast;

@Service
public interface PodcastService {

	List<Podcast> getAllPodcasts();

	Podcast getPodcastById(Long id);
	
	Podcast savePodcast(Podcast podcast);

	void deletePodcastById(Long id);

	List<Podcast> searchPodcasts(String searchTerm);
	List<Podcast> findByTheme(String theme);
	List<Podcast> findByDureeLessThanEqual(int dureeEnSecondes);
	List<Podcast> findWithFilters(String searchTerm, String theme, Integer dureeMax);

}
