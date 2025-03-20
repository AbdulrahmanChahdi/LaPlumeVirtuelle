package com.example.laplumevirtuel.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.laplumevirtuel.entities.Commentaire;
import com.example.laplumevirtuel.services.CommentaireService;

@RestController
@RequestMapping("/api/v4/Commentaire")
public class CommentaireController {
	
	@Autowired
	CommentaireService commentaireService;
	
	@GetMapping("/all")
	public List<Commentaire>getAllCommentaires(){
		return commentaireService.getAllCommentaires();
	}
	
	@GetMapping("/{id}")
	public Commentaire findCommentaireById(@PathVariable(name = "id") Long id) {
		return commentaireService.getCommentaireById(id);
	}
	@PostMapping("/save")
	public Commentaire saveCommentaire(@RequestBody Commentaire commentaire) {
		return commentaireService.saveCommentaire(commentaire);
	}
	
	@DeleteMapping("/delete/{id}")
	public void deleteCommentaireById(@PathVariable(name = "id") Long id) {
		commentaireService.deleteCommentaire(id);
	}
}
