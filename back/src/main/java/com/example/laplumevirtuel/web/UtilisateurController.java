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

import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.services.UtilisateurService;


@RestController
@RequestMapping("/api/v9/Utilisateur")
public class UtilisateurController {
	
	@Autowired
	UtilisateurService utilisateurService;
	
	@GetMapping("/test")
	public String test() {
	return "Api Functional ok";
	}
	
	@GetMapping("/all")
	public List<Utilisateur>getAUtilisateurs(){
		return utilisateurService.getAllUtilisateurs();
	}
	
	@GetMapping("/{id}")
	public Utilisateur getUtilisateur(@PathVariable(name = "id") Long id) {
		return utilisateurService.getUtilisateursById(id);
				
	}
	
	@PostMapping("/save")
	public Utilisateur addUtilisateur(@RequestBody Utilisateur utilisateur) {
		return utilisateurService.saveUtilisateur(utilisateur);
	}
	
	@DeleteMapping("/delete/{id}")
	public void deleteUtilisateurById(@PathVariable(name = "id") Long id) {
		utilisateurService.deleteUtilisateurById(id);
	}
	

}
