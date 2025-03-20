package com.example.laplumevirtuel.services;

import java.util.List;
import java.util.stream.Collectors;

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
	public LivreAudio getLivreAudioById(Long id) {
		return livreAudioRepository.findById(id).orElse(null);
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
	public List<LivreAudio> searchLivresAudio(String searchTerm) {
		if (searchTerm == null || searchTerm.trim().isEmpty()) {
			return getAllLivreAudios();
		}
		return livreAudioRepository.searchLivresAudio(searchTerm.trim());
	}

	@Override
	public List<LivreAudio> findByCategorie(Long categorieId) {
		if (categorieId == null) {
			return getAllLivreAudios();
		}
		return livreAudioRepository.findByCategorie(categorieId);
	}

	@Override
	public List<LivreAudio> findByDureeLessThanEqual(int heures) {
		return livreAudioRepository.findByDureeLessThanEqual(heures);
	}

	@Override
	public List<LivreAudio> findWithFilters(String searchTerm, Long categorieId, Integer dureeMax) {
		List<LivreAudio> result = getAllLivreAudios();
		
		if (searchTerm != null && !searchTerm.trim().isEmpty()) {
			result = livreAudioRepository.searchLivresAudio(searchTerm.trim());
		}
		
		if (categorieId != null) {
			result = result.stream()
				.filter(la -> la.getLivre().getCategorie().getId().equals(categorieId))
				.collect(Collectors.toList());
		}
		
		if (dureeMax != null) {
			result = result.stream()
				.filter(la -> {
					try {
						String dureeStr = la.getDuree().replace("h", "").trim();
						int duree = Integer.parseInt(dureeStr);
						return duree <= dureeMax;
					} catch (NumberFormatException e) {
						return false;
					}
				})
				.collect(Collectors.toList());
		}
		
		return result;
	}
}
