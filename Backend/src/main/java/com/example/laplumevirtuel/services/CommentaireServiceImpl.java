package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.laplumevirtuel.entities.Commentaire;
import com.example.laplumevirtuel.repository.CommentaireRepository;

@Service
public class CommentaireServiceImpl implements CommentaireService {

	@Autowired
	private CommentaireRepository commentaireRepository;

	@Override
	public List<Commentaire> getAllCommentaires() {
		return commentaireRepository.findAll();
	}
	
	@Override
	public Commentaire getCommentaireById(Long id) {
		return commentaireRepository.findById(id).orElse(null);
	}

	@Override
	public Commentaire saveCommentaire(Commentaire commentaire) {
		return commentaireRepository.save(commentaire);
	}

	@Override
	public void deleteCommentaire(Long id) {
		commentaireRepository.deleteById(id);

	}


}
