package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Auteur;
import com.example.laplumevirtuel.repository.AuteurRepository;

@Service
public class AuteurServiceImpl implements AuteurService {
	
	@Autowired
	private AuteurRepository auteurRepository;
	
	public List<Auteur>getAllAuteurs(){
		return auteurRepository.findAll();
	}
	
	public Auteur getAuteurById(Long id) {
		return auteurRepository.findById(id).orElse(null);
		
	}
	public Auteur saveAuteur (Auteur auteur) {
		return auteurRepository.save(auteur);
	
	}
	public void deleteAuteurById(Long id) {
		auteurRepository.deleteById(id);
	}
	

}
