package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.UtilisateurRepository;

@Service
public class UtilisateurServiceimpl implements UtilisateurService{
	
	@Autowired
	private UtilisateurRepository utilisateurRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	
	

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
	        Utilisateur existing = utilisateurRepository.findById(utilisateur.getId())
	                .orElseThrow(() -> new RuntimeException("L'utilisateur avec l'ID " + utilisateur.getId() + " n'existe pas."));

	        String rawPassword = utilisateur.getMotDePasse();
	        if (rawPassword == null || rawPassword.trim().isEmpty()) {
	            utilisateur.setMotDePasse(existing.getMotDePasse());
	        } else {
	            utilisateur.setMotDePasse(passwordEncoder.encode(rawPassword));
	        }
	    } else {
	        String rawPassword = utilisateur.getMotDePasse();
	        if (rawPassword == null || rawPassword.trim().isEmpty()) {
	            throw new RuntimeException("Le mot de passe est obligatoire pour créer un utilisateur.");
	        }
	        utilisateur.setMotDePasse(passwordEncoder.encode(rawPassword));
	    }

	    return utilisateurRepository.save(utilisateur);
	}

	
	@Override
	public void deleteUtilisateurById(Long id) {
		utilisateurRepository.deleteById(id);
	}
	
}
