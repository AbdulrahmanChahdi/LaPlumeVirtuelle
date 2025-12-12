package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Livre;
import com.example.laplumevirtuel.repository.LivreRepository;

@Service
public class LivreServiceImpl  implements LivreService{
	@Autowired
	private LivreRepository livreRepository;
	
	@Override
	public List<Livre>getAllLivres(){
		return livreRepository.findAll();
	}
	@Override
	public Livre getLivreById(Long id) {
		return livreRepository.findById(id).orElse(null);
	}
	
	@Override
	public Livre saveLivre(Livre livre) {
		return livreRepository.save(livre);
	}
	
	@Override
	public void deleteLivreById(Long id) {
		livreRepository.deleteById(id);
	}

}
