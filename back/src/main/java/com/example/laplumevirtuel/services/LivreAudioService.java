package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.LivreAudio;

@Service
public interface LivreAudioService {
	
	
	 List<LivreAudio>getAllLivreAudios();
	
	 LivreAudio getLivreAudioById(Long id);
	
	 LivreAudio saveLivreAudio(LivreAudio livreAudio);
	
	 void deleteLivreAudioById(Long id);
	
	 List<LivreAudio> searchLivresAudio(String searchTerm);
	
	 List<LivreAudio> findByCategorie(Long categorieId);
	
	 List<LivreAudio> findByDureeLessThanEqual(int heures);
	
	 List<LivreAudio> findWithFilters(String searchTerm, Long categorieId, Integer dureeMax);
}
