package com.example.laplumevirtuel.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.laplumevirtuel.entities.Categorie;
import com.example.laplumevirtuel.services.CategorieService;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200")
public class CategorieController {
	
	@Autowired
	private CategorieService categorieService;
	
	@GetMapping
	public List<Categorie> getAllCategories() {
		return categorieService.getAllCategorie();
	}
	
	@GetMapping("/{id}")
	public Categorie getCategorieById(@PathVariable Long id) {
		return categorieService.getCategorieById(id);
	}
	
	@PostMapping
	public Categorie saveCategorie(@RequestBody Categorie categorie) {
		return categorieService.saveCategorie(categorie);
	}
	
	@DeleteMapping("/{id}")
	public void deleteCategorie(@PathVariable Long id) {
		categorieService.deleteCategorieById(id);
	}
	

}
