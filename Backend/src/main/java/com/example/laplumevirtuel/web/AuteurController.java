package com.example.laplumevirtuel.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.laplumevirtuel.entities.Auteur;
import com.example.laplumevirtuel.services.AuteurService;

@RestController
@RequestMapping("/api/auteurs")
@CrossOrigin(origins = "http://localhost:4200")
public class AuteurController {
	
	@Autowired
	private AuteurService auteurService;
	
	@GetMapping
	public List<Auteur> getAllAuteurs() {
		return auteurService.getAllAuteurs();
	}

	@GetMapping("/{id}")
	public Auteur getAuteurById(@PathVariable Long id) {
		return auteurService.getAuteurById(id);
	}

	@PostMapping
	public Auteur saveAuteur(@RequestBody Auteur auteur) {
		return auteurService.saveAuteur(auteur);
	}

	@DeleteMapping("/{id}")
	public void deleteAuteurById(@PathVariable Long id) {
		auteurService.deleteAuteurById(id);
	}
}
