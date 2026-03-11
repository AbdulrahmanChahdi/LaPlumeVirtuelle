package com.example.laplumevirtuel.controller;

import com.example.laplumevirtuel.dto.UserDTO;
import com.example.laplumevirtuel.entities.Auteur;
import com.example.laplumevirtuel.entities.Categorie;
import com.example.laplumevirtuel.entities.Livre;
import com.example.laplumevirtuel.entities.LivreAudio;
import com.example.laplumevirtuel.entities.Podcast;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.AuteurRepository;
import com.example.laplumevirtuel.repository.CategorieRepository;
import com.example.laplumevirtuel.repository.LivreAudioRepository;
import com.example.laplumevirtuel.repository.LivreRepository;
import com.example.laplumevirtuel.repository.PodcastRepository;
import com.example.laplumevirtuel.repository.UtilisateurRepository;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:5173"})
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final LivreRepository livreRepository;
    private final LivreAudioRepository livreAudioRepository;
    private final PodcastRepository podcastRepository;
    private final AuteurRepository auteurRepository;
    private final CategorieRepository categorieRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(LivreRepository livreRepository,
                           LivreAudioRepository livreAudioRepository,
                           PodcastRepository podcastRepository,
                           AuteurRepository auteurRepository,
                           CategorieRepository categorieRepository,
                           UtilisateurRepository utilisateurRepository,
                           PasswordEncoder passwordEncoder) {
        this.livreRepository = livreRepository;
        this.livreAudioRepository = livreAudioRepository;
        this.podcastRepository = podcastRepository;
        this.auteurRepository = auteurRepository;
        this.categorieRepository = categorieRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Categorie>> getAllCategories() {
        return ResponseEntity.ok(categorieRepository.findAll());
    }

    @GetMapping("/auteurs")
    public ResponseEntity<List<Auteur>> getAllAuteurs() {
        return ResponseEntity.ok(auteurRepository.findAll());
    }

    // ==================== LIVRES ====================

    @GetMapping("/livres")
    public ResponseEntity<List<Livre>> getAllLivres() {
        return ResponseEntity.ok(livreRepository.findAll());
    }

    @GetMapping("/livres/{id}")
    public ResponseEntity<Livre> getLivreById(@PathVariable Long id) {
        return livreRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/livres")
    public ResponseEntity<Livre> createLivre(@RequestBody Map<String, Object> data) {
        Livre livre = new Livre();
        applyLivreData(livre, data);
        Livre saved = livreRepository.save(livre);
        log.info("Admin: livre créé avec id={}", saved.getId());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/livres/{id}")
    public ResponseEntity<Livre> updateLivre(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        return livreRepository.findById(id).map(livre -> {
            applyLivreData(livre, data);
            Livre updated = livreRepository.save(livre);
            log.info("Admin: livre id={} modifié", id);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/livres/{id}")
    public ResponseEntity<Void> deleteLivre(@PathVariable Long id) {
        if (!livreRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        livreRepository.deleteById(id);
        log.info("Admin: livre id={} supprimé", id);
        return ResponseEntity.noContent().build();
    }

    // ==================== LIVRES AUDIO ====================

    @GetMapping("/livres-audio")
    public ResponseEntity<List<LivreAudio>> getAllLivresAudio() {
        return ResponseEntity.ok(livreAudioRepository.findAll());
    }

    @GetMapping("/livres-audio/{id}")
    public ResponseEntity<LivreAudio> getLivreAudioById(@PathVariable Long id) {
        return livreAudioRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/livres-audio")
    public ResponseEntity<LivreAudio> createLivreAudio(@RequestBody Map<String, Object> data) {
        LivreAudio livreAudio = new LivreAudio();
        applyLivreAudioData(livreAudio, data);
        LivreAudio saved = livreAudioRepository.save(livreAudio);
        log.info("Admin: livre audio créé avec id={}", saved.getId());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/livres-audio/{id}")
    public ResponseEntity<LivreAudio> updateLivreAudio(@PathVariable Long id, @RequestBody Map<String, Object> data) {
        return livreAudioRepository.findById(id).map(la -> {
            applyLivreAudioData(la, data);
            LivreAudio updated = livreAudioRepository.save(la);
            log.info("Admin: livre audio id={} modifié", id);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/livres-audio/{id}")
    public ResponseEntity<Void> deleteLivreAudio(@PathVariable Long id) {
        if (!livreAudioRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        livreAudioRepository.deleteById(id);
        log.info("Admin: livre audio id={} supprimé", id);
        return ResponseEntity.noContent().build();
    }

    // ==================== PODCASTS ====================

    @GetMapping("/podcasts")
    public ResponseEntity<List<Podcast>> getAllPodcasts() {
        return ResponseEntity.ok(podcastRepository.findAll());
    }

    @GetMapping("/podcasts/{id}")
    public ResponseEntity<Podcast> getPodcastById(@PathVariable Long id) {
        return podcastRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/podcasts")
    public ResponseEntity<Podcast> createPodcast(@RequestBody Podcast podcast) {
        Podcast saved = podcastRepository.save(podcast);
        log.info("Admin: podcast créé avec id={}", saved.getId());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/podcasts/{id}")
    public ResponseEntity<Podcast> updatePodcast(@PathVariable Long id, @RequestBody Podcast data) {
        return podcastRepository.findById(id).map(podcast -> {
            podcast.setNom(data.getNom());
            podcast.setDuree(data.getDuree());
            podcast.setTheme(data.getTheme());
            podcast.setAnimateur(data.getAnimateur());
            podcast.setImageUrl(data.getImageUrl());
            Podcast updated = podcastRepository.save(podcast);
            log.info("Admin: podcast id={} modifié", id);
            return ResponseEntity.ok(updated);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/podcasts/{id}")
    public ResponseEntity<Void> deletePodcast(@PathVariable Long id) {
        if (!podcastRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        podcastRepository.deleteById(id);
        log.info("Admin: podcast id={} supprimé", id);
        return ResponseEntity.noContent().build();
    }

    // ==================== UTILISATEURS ====================

    @GetMapping("/utilisateurs")
    public ResponseEntity<List<UserDTO>> getAllUtilisateurs() {
        List<UserDTO> users = utilisateurRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/utilisateurs/{id}")
    public ResponseEntity<UserDTO> getUtilisateurById(@PathVariable Long id) {
        return utilisateurRepository.findById(id)
                .map(u -> ResponseEntity.ok(mapToDTO(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/utilisateurs")
    public ResponseEntity<?> createUtilisateur(@RequestBody Utilisateur utilisateur) {
        if (utilisateurRepository.findByAdresseMail(utilisateur.getAdresseMail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }
        utilisateur.setMotDePasse(passwordEncoder.encode(utilisateur.getMotDePasse()));
        if (utilisateur.getRole() == null || utilisateur.getRole().isBlank()) {
            utilisateur.setRole("USER");
        }
        Utilisateur saved = utilisateurRepository.save(utilisateur);
        log.info("Admin: utilisateur créé avec id={}", saved.getId());
        return ResponseEntity.ok(mapToDTO(saved));
    }

    @PutMapping("/utilisateurs/{id}")
    public ResponseEntity<?> updateUtilisateur(@PathVariable Long id, @RequestBody Map<String, String> data) {
        return utilisateurRepository.findById(id).map(u -> {
            if (data.containsKey("nom")) u.setNom(data.get("nom"));
            if (data.containsKey("adresseMail")) u.setAdresseMail(data.get("adresseMail"));
            if (data.containsKey("adressePostal")) u.setAdressePostal(data.get("adressePostal"));
            if (data.containsKey("tel")) u.setTel(data.get("tel"));
            if (data.containsKey("role")) u.setRole(data.get("role"));
            if (data.containsKey("motDePasse") && !data.get("motDePasse").isBlank()) {
                u.setMotDePasse(passwordEncoder.encode(data.get("motDePasse")));
            }
            Utilisateur updated = utilisateurRepository.save(u);
            log.info("Admin: utilisateur id={} modifié", id);
            return ResponseEntity.ok((Object) mapToDTO(updated));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/utilisateurs/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        if (!utilisateurRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        utilisateurRepository.deleteById(id);
        log.info("Admin: utilisateur id={} supprimé", id);
        return ResponseEntity.noContent().build();
    }

    private UserDTO mapToDTO(Utilisateur u) {
        UserDTO dto = new UserDTO();
        dto.setId(u.getId());
        dto.setNom(u.getNom());
        dto.setAdresseMail(u.getAdresseMail());
        dto.setAdressePostal(u.getAdressePostal());
        dto.setTel(u.getTel());
        dto.setRole(u.getRole());
        dto.setDateInscription(u.getDateInscription());
        return dto;
    }

    private void applyLivreData(Livre livre, Map<String, Object> data) {
        livre.setTitre(asString(data.get("titre")));
        livre.setAnneeEdition(asString(data.get("anneeEdition")));
        livre.setLangue(asString(data.get("langue")));
        livre.setResume(asString(data.get("resume")));
        livre.setImageUrl(asString(data.get("imageUrl")));
        livre.setExternalId(asString(data.get("externalId")));

        Integer pages = asInteger(data.get("nombreDePage"));
        livre.setNombreDePage(pages == null ? 0 : pages);

        Boolean disponible = asBoolean(data.get("disponible"));
        livre.setDisponible(disponible != null && disponible);

        Long categorieId = asLong(data.get("categorieId"));
        if (categorieId != null) {
            categorieRepository.findById(categorieId).ifPresent(livre::setCategorie);
        } else {
            String categorieNom = asString(data.get("categorieNom"));
            if (categorieNom != null && !categorieNom.isBlank()) {
                categorieRepository.findByNomIgnoreCase(categorieNom.trim()).ifPresent(livre::setCategorie);
            }
        }

        Long auteurId = asLong(data.get("auteurId"));
        if (auteurId != null) {
            auteurRepository.findById(auteurId).ifPresent(livre::setAuteur);
        } else {
            String auteurNom = asString(data.get("auteurNom"));
            if (auteurNom != null && !auteurNom.isBlank()) {
                Auteur auteur = auteurRepository.findByNomIgnoreCase(auteurNom.trim())
                        .orElseGet(() -> {
                            Auteur a = new Auteur();
                            a.setNom(auteurNom.trim());
                            return auteurRepository.save(a);
                        });
                livre.setAuteur(auteur);
            }
        }
    }

    private void applyLivreAudioData(LivreAudio livreAudio, Map<String, Object> data) {
        livreAudio.setTitre(asString(data.get("titre")));
        livreAudio.setDuree(asString(data.get("duree")));
        livreAudio.setNarrateur(asString(data.get("narrateur")));
        livreAudio.setAudioUrl(asString(data.get("audioUrl")));

        Long livreId = asLong(data.get("livreId"));
        if (livreId != null) {
            livreRepository.findById(livreId).ifPresent(livreAudio::setLivre);
        }
    }

    private String asString(Object value) {
        return value == null ? null : String.valueOf(value);
    }

    private Long asLong(Object value) {
        if (value == null) return null;
        if (value instanceof Number n) return n.longValue();
        try {
            String s = String.valueOf(value).trim();
            if (s.isEmpty()) return null;
            return Long.parseLong(s);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Integer asInteger(Object value) {
        if (value == null) return null;
        if (value instanceof Number n) return n.intValue();
        try {
            String s = String.valueOf(value).trim();
            if (s.isEmpty()) return null;
            return Integer.parseInt(s);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Boolean asBoolean(Object value) {
        if (value == null) return null;
        if (value instanceof Boolean b) return b;
        return Boolean.parseBoolean(String.valueOf(value));
    }
}
