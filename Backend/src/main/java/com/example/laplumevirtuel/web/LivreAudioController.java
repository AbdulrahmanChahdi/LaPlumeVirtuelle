package com.example.laplumevirtuel.web;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.laplumevirtuel.entities.LivreAudio;
import com.example.laplumevirtuel.services.LivreAudioService;

@RestController
@RequestMapping("/api/livres-audio")
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:5173" })
public class LivreAudioController {

	@Autowired
	private LivreAudioService livreAudioService;

	@GetMapping
	public List<LivreAudio> getAllLivreAudios(
			@RequestParam(required = false) String search,
			@RequestParam(required = false) Long categorieId,
			@RequestParam(required = false) Integer dureeMax) {
		if (search != null || categorieId != null || dureeMax != null) {
			return livreAudioService.findWithFilters(search, categorieId, dureeMax);
		}
		return livreAudioService.getAllLivreAudios();
	}

	@GetMapping("/search")
	public List<LivreAudio> searchLivresAudio(@RequestParam String term) {
		return livreAudioService.searchLivresAudio(term);
	}

	@GetMapping("/categorie/{categorieId}")
	public List<LivreAudio> getLivresByCategorie(@PathVariable Long categorieId) {
		return livreAudioService.findByCategorie(categorieId);
	}

	@GetMapping("/duree/{heures}")
	public List<LivreAudio> getLivresByDuree(@PathVariable int heures) {
		return livreAudioService.findByDureeLessThanEqual(heures);
	}

	@GetMapping("/{id}")
	public LivreAudio getLivreAudioById(@PathVariable Long id) {
		return livreAudioService.getLivreAudioById(id);
	}

	@PostMapping
	public LivreAudio saveAudio(@RequestBody LivreAudio livreAudio) {
		return livreAudioService.saveLivreAudio(livreAudio);
	}

	@DeleteMapping("/{id}")
	public void deleteLivreAudioById(@PathVariable Long id) {
		livreAudioService.deleteLivreAudioById(id);
	}
}
