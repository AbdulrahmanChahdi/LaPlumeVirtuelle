package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Editeur;

@Service
public interface EditeurService {

	List<Editeur> getAllEditeurs();

	Editeur getEditeurById(Long id);

	Editeur saveEditeur(Editeur editeur);

	void deleteEditeurById(Long id);
}
