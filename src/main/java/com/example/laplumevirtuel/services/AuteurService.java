package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Auteur;

@Service
public interface AuteurService {

	List<Auteur> getAllAuteurs();

	Auteur getAuteurById(Long id);

	Auteur saveAuteur(Auteur auteur);

	void deleteAuteurById(Long id);

}
