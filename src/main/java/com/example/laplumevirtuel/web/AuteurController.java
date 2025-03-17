package com.example.laplumevirtuel.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.laplumevirtuel.entities.Auteur;
import com.example.laplumevirtuel.services.AuteurService;

@RestController
@RequestMapping("/api/v2/Auteur")
public class AuteurController {
	
	@Autowired
	AuteurService auteurService;
	
	@GetMapping("/all")
	public List<Auteur>getAllAuteurs(){
		return auteurService.getAllAuteurs();
	}
	@GetMapping("/{id}")
	public Auteur getAuteurById(@PathVariable(name = "id") Long id) {
		return auteurService.getAuteurById (id);
	}
	@PostMapping("/save")
	public Auteur saveAuteur() {
		return auteurService.saveAuteur(null);
	}
	@DeleteMapping("/delete/{id}")
	public void deleteAuteurById(@PathVariable(name = "id") Long id) {
		auteurService.deleteAuteurById(id);
		
	}
}
