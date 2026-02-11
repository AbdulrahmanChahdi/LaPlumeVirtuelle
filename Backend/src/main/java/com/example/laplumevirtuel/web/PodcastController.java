package com.example.laplumevirtuel.web;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.laplumevirtuel.entities.Podcast;
import com.example.laplumevirtuel.services.PodcastService;

@RestController
@RequestMapping("/api/podcasts")
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:5173" })
public class PodcastController {

	@Autowired
	private PodcastService podcastService;

	@GetMapping
	public List<Podcast> getAllPodcasts(
			@RequestParam(required = false) String search,
			@RequestParam(required = false) String theme,
			@RequestParam(required = false) Integer dureeMax) {
		if (search != null || theme != null || dureeMax != null) {
			return podcastService.findWithFilters(search, theme, dureeMax);
		}
		return podcastService.getAllPodcasts();
	}

	@GetMapping("/search")
	public List<Podcast> searchPodcasts(@RequestParam String term) {
		return podcastService.searchPodcasts(term);
	}

	@GetMapping("/theme/{theme}")
	public List<Podcast> getPodcastsByTheme(@PathVariable String theme) {
		return podcastService.findByTheme(theme);
	}

	@GetMapping("/duree/{secondes}")
	public List<Podcast> getPodcastsByDuree(@PathVariable int secondes) {
		return podcastService.findByDureeLessThanEqual(secondes);
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