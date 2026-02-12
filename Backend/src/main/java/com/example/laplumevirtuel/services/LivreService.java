package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Livre;

@Service
public interface LivreService {

	 List<Livre> getAllLivres();

	 Livre saveLivre (Livre livre);
	 
	 Livre getLivreById (Long id);

	 void deleteLivreById(Long id);
	 
	 /**
	  * Search books by keyword (title, author, year)
	  */
	 List<Livre> searchLivres(String keyword);
}
