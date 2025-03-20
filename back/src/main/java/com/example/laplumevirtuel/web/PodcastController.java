package com.example.laplumevirtuel.web;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.laplumevirtuel.entities.Podcast;
import com.example.laplumevirtuel.services.PodcastService;

@RestController
@RequestMapping("/api/podcasts")
@CrossOrigin(origins = "http://localhost:4200")
public class PodcastController {

	@Autowired
	private PodcastService podcastService;

	@GetMapping
	public List<Podcast> getAllPodcasts() {
		return podcastService.getAllPodcasts();
	}

	@GetMapping("/{id}")
	public Podcast getPodcastById(@PathVariable Long id) {
		return podcastService.getPodcastById(id);
	}

	@PostMapping
	public Podcast savePodcast(@RequestBody Podcast podcast) {
		return podcastService.savePodcast(podcast);
	}

	@DeleteMapping("/{id}")
	public void deletePodcastById(@PathVariable Long id) {
		podcastService.deletePodcastById(id);
	}
}