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

@RestController
@RequestMapping("/api/v5/Editeur")
public class EditeurController {
	
	@Autowired
	EditeurService editeurService;
	
	@GetMapping("/all")
	public List<Editeur>getAllEditeurs(){
		return editeurService.getAllEditeurs();
	}
	
	@GetMapping("/{id}")
	public Editeur getEditeurById(@PathVariable(name = "id") Long id) {
		return editeurService.getEditeurById(id);
	}
	
	@PostMapping("/save")
	public Editeur saveEditeur(@RequestBody Editeur editeur) {
		return editeurService.saveEditeur(null);
	}
	
	@DeleteMapping("/delete/{id}")
	public void deleteEditeur(@PathVariable(name = "id") Long id){
		editeurService.deleteEditeurById(id);
		
	}
	

}
