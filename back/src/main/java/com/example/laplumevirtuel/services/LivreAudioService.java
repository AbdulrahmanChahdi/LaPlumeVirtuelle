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
}
