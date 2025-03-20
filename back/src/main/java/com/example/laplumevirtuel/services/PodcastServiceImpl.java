package com.example.laplumevirtuel.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Podcast;
import com.example.laplumevirtuel.repository.PodcastRepository;

@Service
public class PodcastServiceImpl implements PodcastService {
	
	@Autowired
	private PodcastRepository podcastRepository;
	
	@Override
	public List<Podcast> getAllPodcasts() {
		return podcastRepository.findAll();
	}
	
	@Override
	public Podcast getPodcastById(Long id) {
		return podcastRepository.findById(id).orElse(null);
	}
	
	@Override
	public Podcast savePodcast(Podcast podcast) {
		return podcastRepository.save(podcast);
	}

	@Override
	public void deletePodcastById(Long id) {
		podcastRepository.deleteById(id);
	}
	
	@Override
	public List<Podcast> searchPodcasts(String searchTerm) {
		if (searchTerm == null || searchTerm.trim().isEmpty()) {
			return getAllPodcasts();
		}
		return podcastRepository.searchPodcasts(searchTerm.trim());
	}
	
	@Override
	public List<Podcast> findByTheme(String theme) {
		if (theme == null || theme.trim().isEmpty()) {
			return getAllPodcasts();
		}
		return podcastRepository.findByTheme(theme.trim());
	}
	
	@Override
	public List<Podcast> findByDureeLessThanEqual(int dureeEnSecondes) {
		return podcastRepository.findByDureeLessThanEqual(dureeEnSecondes);
	}
	
	@Override
	public List<Podcast> findWithFilters(String searchTerm, String theme, Integer dureeMax) {
		List<Podcast> result = getAllPodcasts();
		
		if (searchTerm != null && !searchTerm.trim().isEmpty()) {
			result = podcastRepository.searchPodcasts(searchTerm.trim());
		}
		
		if (theme != null && !theme.trim().isEmpty()) {
			result = result.stream()
				.filter(p -> p.getTheme().equalsIgnoreCase(theme.trim()))
				.collect(Collectors.toList());
		}
		
		if (dureeMax != null) {
			result = result.stream()
				.filter(p -> p.getDuree() <= dureeMax)
				.collect(Collectors.toList());
		}
		
		return result;
	}
}
