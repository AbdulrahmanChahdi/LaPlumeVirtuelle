package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Categorie;
import com.example.laplumevirtuel.repository.CategorieRepository;

@Service
public class CategorieServiceImpl implements CategorieService {
	@Autowired
	private CategorieRepository categorieRepository;
	
	@Override
	public List<Categorie>getAllCategorie(){
		return categorieRepository.findAll();
		}
	@Override
	public Categorie getCategorieById(Long id) {
		return categorieRepository.findById(id).orElse(null);
		}
	@Override
	public Categorie saveCategorie(Categorie categorie) {
		return categorieRepository.save(categorie);
	}
	@Override
	public void deleteCategorieById (Long id) {
		categorieRepository.deleteById(id);
	}

}