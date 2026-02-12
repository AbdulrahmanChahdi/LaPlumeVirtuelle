package com.example.laplumevirtuel.web;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.example.laplumevirtuel.entities.Livre;
import com.example.laplumevirtuel.services.LivreService;
import com.example.laplumevirtuel.service.ExternalBookService;
import com.example.laplumevirtuel.dto.BookSearchResultDTO;

@RestController
@RequestMapping("/api/livres")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
public class LivreController {

	@Autowired
	private LivreService livreService;
	
	@Autowired
	private ExternalBookService externalBookService;
	
	@GetMapping
	public List<Livre> getAllLivres() {
		return livreService.getAllLivres();
	}
	
	/**
	 * Search books by keyword (searches in title, author, year)
	 */
	@GetMapping("/search")
	public List<Livre> searchLivres(@RequestParam String keyword) {
		return livreService.searchLivres(keyword);
	}

	@GetMapping("/{id}")
	public Livre getLivreById(@PathVariable Long id) {
		return livreService.getLivreById(id);
	}

	@PostMapping("/add")
	public Livre saveLivre(@RequestBody Livre livre) {
		return livreService.saveLivre(livre);
	}
	
	@DeleteMapping("/{id}")
	public void deleteLivre(@PathVariable Long id) {
		livreService.deleteLivreById(id);
	}
	
	/**
	 * Add a book from Open Library to user's personal library
	 */
	@PostMapping("/add-from-external/{externalId}")
	public ResponseEntity<?> addBookFromExternal(
			@PathVariable String externalId,
			Authentication authentication) {

		if (externalId == null || externalId.trim().isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("error", "External ID manquant."));
		}
		
		if (authentication == null) {
			return ResponseEntity.status(401).body(Map.of("error", "Non autorisé."));
		}
		
		String email = (String) authentication.getPrincipal();
		
		// Get book details from Open Library
		BookSearchResultDTO externalBook = externalBookService.getBookById(externalId);
		
		if (externalBook == null) {
			return ResponseEntity.notFound().build();
		}
		
		// Create new Livre entity
		Livre livre = new Livre();
		livre.setTitre(externalBook.getTitle());
		livre.setExternalId(externalBook.getExternalId());
		livre.setResume(externalBook.getDescription());
		livre.setImageUrl(externalBook.getCoverUrl());
		livre.setLangue(externalBook.getLanguage());
		livre.setNombreDePage(externalBook.getPageCount() != null ? externalBook.getPageCount() : 0);
		livre.setAnneeEdition(externalBook.getPublishedDate());
		livre.setDisponible(true);
		
		try {
			// Save to database
			Livre savedBook = livreService.saveLivre(livre);
			return ResponseEntity.ok(savedBook);
		} catch (RuntimeException ex) {
			return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
		}
	}
}
