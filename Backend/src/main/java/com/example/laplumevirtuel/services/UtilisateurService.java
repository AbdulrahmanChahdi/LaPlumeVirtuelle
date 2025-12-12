package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Utilisateur;

@Service
public interface UtilisateurService {
	
	
	
	 List<Utilisateur>getAllUtilisateurs();
	
	 Utilisateur getUtilisateursById(Long id);
	
	 Utilisateur saveUtilisateur(Utilisateur utilisateur);
	
	 void deleteUtilisateurById(Long id);
	
}
