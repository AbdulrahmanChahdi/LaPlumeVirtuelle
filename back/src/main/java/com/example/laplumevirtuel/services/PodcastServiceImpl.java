package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Podcast;
import com.example.laplumevirtuel.repository.PodcastRepository;

@Service
public class PodcastServiceImpl implements PodcastService {
	
	@Autowired
	private PodcastRepository podcastRepository;
	
	@Override
	public List<Podcast>getAllPodcasts(){
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


	
}
