package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Editeur;
import com.example.laplumevirtuel.repository.EditeurRepository;

@Service
public class EditeurServiceImpl implements EditeurService{
	@Autowired
	private EditeurRepository editeurRepository;
	
	@Override
	public List<Editeur>getAllEditeurs(){
		return editeurRepository.findAll();
	}
	
	@Override
	public Editeur getEditeurById(Long id) {
		return editeurRepository.findById(id).orElse(null);
	}
	
	@Override
	public Editeur saveEditeur(Editeur editeur) {
		return editeurRepository.save(editeur);
	}
	
	@Override
	public void deleteEditeurById(Long id) {
		editeurRepository.deleteById(id);
	}
}
