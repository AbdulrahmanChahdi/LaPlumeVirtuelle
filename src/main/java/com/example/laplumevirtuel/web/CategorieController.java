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

import com.example.laplumevirtuel.entities.Categorie;
import com.example.laplumevirtuel.services.CategorieService;

@RestController
@RequestMapping("/api/v3/Categorie")
public class CategorieController {
	
	@Autowired
	CategorieService categorieService;
	
	@GetMapping("/all")
	public List<Categorie>findAllCategorie(){
		return categorieService.getAllCategorie();
	}
	
	@GetMapping("/{id}")
	public Categorie findCategorieById(@PathVariable(name = "id") Long id) {
		return categorieService.getCategorieById(id);
	}
	
	@PostMapping("/save")
	public Categorie saveCategorie(@RequestBody Categorie categorie) {
		return categorieService.saveCategorie(categorie);
	}
	
	@DeleteMapping("/delete/{id}")
	public void deleteCategorie(@PathVariable(name = "id") Long id) {
		categorieService.deleteCategorieById(id);
		
	}
	

}
