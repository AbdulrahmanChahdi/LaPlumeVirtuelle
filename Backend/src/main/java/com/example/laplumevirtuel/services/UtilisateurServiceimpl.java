package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.UtilisateurRepository;

@Service
public class UtilisateurServiceimpl implements UtilisateurService{
	
	@Autowired
	private UtilisateurRepository utilisateurRepository;
	
	
	

	@Override
	public List<Utilisateur> getAllUtilisateurs(){
		return utilisateurRepository.findAll();
	}
	
	@Override
	public Utilisateur getUtilisateursById(Long id) {
		return utilisateurRepository.findById(id).orElse(null);
	}
	
	@Override
	public Utilisateur saveUtilisateur(Utilisateur utilisateur) {
	    if (utilisateur.getId() != null) {
	        if (!utilisateurRepository.existsById(utilisateur.getId())) {
	            throw new RuntimeException("L'utilisateur avec l'ID " + utilisateur.getId() + " n'existe pas.");
	        }
	    }
	    return utilisateurRepository.save(utilisateur);
	}

	
	@Override
	public void deleteUtilisateurById(Long id) {
		utilisateurRepository.deleteById(id);
	}
	
}
