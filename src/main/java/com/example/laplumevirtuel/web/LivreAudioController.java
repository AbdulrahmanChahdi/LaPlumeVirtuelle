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

import com.example.laplumevirtuel.entities.LivreAudio;
import com.example.laplumevirtuel.services.LivreAudioService;

@RestController
@RequestMapping("/api/v6/LivreAudio")
public class LivreAudioController {
	
	@Autowired
	LivreAudioService livreAudioService;
	
	@GetMapping("/all")
	public List<LivreAudio>getAllLivreAudios(){
		return livreAudioService.getAllLivreAudios();
	}
	
	@GetMapping("/{id}")
	public LivreAudio getLivreAudioById(@PathVariable(name = "id") Long id) {
		return livreAudioService.getLivreAudioById(id);
	}
	
	@PostMapping("/save")
	public LivreAudio saveAudio(@RequestBody LivreAudio livreAudio) {
		return livreAudioService.saveLivreAudio(livreAudio);
	}
	
	@DeleteMapping("/delete/{id}")
	public void deleteLivreAudioById(@PathVariable(name = "id") Long id) {
		livreAudioService.deleteLivreAudioById(id);
}
		
}
