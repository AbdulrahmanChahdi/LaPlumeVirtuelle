package com.example.laplumevirtuel.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Commentaire;

@Service
public interface CommentaireService {

	List<Commentaire> getAllCommentaires();
	
	Commentaire getCommentaireById(Long id);

	Commentaire saveCommentaire(Commentaire commentaire);

	void deleteCommentaire(Long id);


}
