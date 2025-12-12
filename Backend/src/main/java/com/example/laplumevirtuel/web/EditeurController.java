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
import com.example.laplumevirtuel.entities.Editeur;
import com.example.laplumevirtuel.services.EditeurService;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/editeurs")
@CrossOrigin(origins = "http://localhost:4200")
public class EditeurController {
	
	@Autowired
	EditeurService editeurService;
	
	@GetMapping
	public List<Editeur> getAllEditeurs() {
		return editeurService.getAllEditeurs();
	}
	
	@GetMapping("/{id}")
	public Editeur getEditeurById(@PathVariable Long id) {
		return editeurService.getEditeurById(id);
	}
	
	@PostMapping
	public Editeur saveEditeur(@RequestBody Editeur editeur) {
		return editeurService.saveEditeur(editeur);
	}
	
	@DeleteMapping("/{id}")
	public void deleteEditeur(@PathVariable Long id) {
		editeurService.deleteEditeurById(id);
	}
}
