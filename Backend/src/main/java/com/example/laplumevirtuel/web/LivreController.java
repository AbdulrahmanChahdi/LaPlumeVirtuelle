package com.example.laplumevirtuel.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.laplumevirtuel.entities.Livre;
import com.example.laplumevirtuel.services.LivreService;

@RestController
@RequestMapping("/api/livres")
@CrossOrigin(origins = "http://localhost:4200")
public class LivreController {

	@Autowired
	private LivreService livreService;
	
	@GetMapping
	public List<Livre> getAllLivres() {
		return livreService.getAllLivres();
	}

	@GetMapping("/{id}")
	public Livre getLivreById(@PathVariable Long id) {
		return livreService.getLivreById(id);
	}

	@PostMapping("/add")
	public Livre saveLivre(@RequestBody Livre livre) {
		return livreService.saveLivre(livre);
	}
	
	@DeleteMapping("/{id}")
	public void deleteLivre(@PathVariable Long id) {
		livreService.deleteLivreById(id);
	}
}
