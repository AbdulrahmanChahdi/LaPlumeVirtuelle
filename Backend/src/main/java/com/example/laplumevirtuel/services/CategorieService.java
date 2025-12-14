package com.example.laplumevirtuel.services;

import java.util.List;

import com.example.laplumevirtuel.entities.Categorie;

public interface CategorieService {

	List<Categorie>getAllCategorie();
	
	Categorie getCategorieById(Long id);
	
	Categorie saveCategorie (Categorie categorie);
	
	void deleteCategorieById(Long id);
}
