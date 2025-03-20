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

import com.example.laplumevirtuel.entities.Abonnement;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.services.AbonnementService;

@RestController
@RequestMapping("/api/v1/Abonnement")
public class AbonnementController {
	
	@Autowired
	AbonnementService abonnementService;
	
	@GetMapping("/all")
	public List<Abonnement>getAllAbonnements(){
		return abonnementService.getAllAbonnements();
	}
	@GetMapping("/{id}")
	public Abonnement getAbonnementById(@PathVariable(name = "id") Long id){
		return abonnementService.findAonnementsById(id);
	}
	@PostMapping("/save")
	public Abonnement addAbonnement(@RequestBody Abonnement abonnement) {
		return abonnementService.saveAbonnement(abonnement);
	}
	@DeleteMapping("/delete/{id}")
	public void deleteAbonnementById(@PathVariable(name = "id") Long id) {
		abonnementService.deleteAbonnementById(id);
	}

}
