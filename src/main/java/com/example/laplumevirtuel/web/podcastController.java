package com.example.laplumevirtuel.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.laplumevirtuel.entities.Podcast;
import com.example.laplumevirtuel.services.PodcastService;

@RestController
@RequestMapping("/api/v8/podcast")
public class podcastController {

	@Autowired
	PodcastService podcastService;

	@GetMapping("/all")
	public List<Podcast> getAllPodcasts() {
		return podcastService.getAllPodcasts();
	}

	@GetMapping("/{id}")
	public Podcast getPodcastById(@PathVariable(name = "id") Long id) {
		return podcastService.getPodcastById(id);
	}

	@PostMapping("/save")
	public Podcast savePodcast(@RequestBody Podcast podcast) {
		return podcastService.savePodcast(null);
	}

	@DeleteMapping("/delete/{id}")
	public void deletePodcastById(@PathVariable(name = "id") Long id) {
		podcastService.deletePodcastById(id);
	}

}