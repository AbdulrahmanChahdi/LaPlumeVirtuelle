package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.LivreAudio;
import com.example.laplumevirtuel.repository.LivreAudioRepository;

@Service
public class LivreAudioServiceimpl implements LivreAudioService {

	@Autowired
	private LivreAudioRepository livreAudioRepository;

	@Override
	public List<LivreAudio> getAllLivreAudios() {
		return livreAudioRepository.findAll();
	}

	@Override

	public LivreAudio saveLivreAudio(LivreAudio livreAudio) {
		return livreAudioRepository.save(livreAudio);
	}

	@Override

	public void deleteLivreAudioById(Long id) {
		livreAudioRepository.deleteById(id);
	}

	@Override
	public LivreAudio getLivreAudioById(Long id) {		return null;
	}
}
