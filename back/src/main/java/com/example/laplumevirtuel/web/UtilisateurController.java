package com.example.laplumevirtuel.web;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.services.UtilisateurService;

@RestController
@RequestMapping("/api/v9/Utilisateur")
@CrossOrigin(origins = "http://localhost:4200")
public class UtilisateurController {

    @Autowired
    UtilisateurService utilisateurService;

    // 🔧 Test basique
    @GetMapping("/test")
    public String test() {
        return "API Fonctionnelle ✅";
    }

    // 🔐 Utilisateur connecté via token Keycloak
    @GetMapping("/me")
    public ResponseEntity<Utilisateur> getOrCreateConnectedUser(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        String name = jwt.getClaimAsString("name");
        String givenName = jwt.getClaimAsString("given_name");
        String familyName = jwt.getClaimAsString("family_name");

        System.out.println("Token claims: " + jwt.getClaims());

        Optional<Utilisateur> existing = utilisateurService.findByEmail(email);

        return existing
            .map(ResponseEntity::ok)
            .orElseGet(() -> {
                Utilisateur newUser = new Utilisateur();
                newUser.setAdresseMail(email);
                newUser.setNom(familyName != null ? familyName : name);
                newUser.setMotDePasse(""); // Pas de mot de passe car authentification via Keycloak
                return ResponseEntity.ok(utilisateurService.saveUtilisateur(newUser));
            });
    }

    // 📄 Tous les utilisateurs (optionnel si route protégée)
    @GetMapping("/all")
    public List<Utilisateur> getAUtilisateurs() {
        return utilisateurService.getAllUtilisateurs();
    }

    @GetMapping("/{id}")
    public Utilisateur getUtilisateur(@PathVariable(name = "id") Long id) {
        return utilisateurService.getUtilisateursById(id);
    }

    // ➕ Créer manuellement un utilisateur (optionnel si Keycloak gère tout)
    @PostMapping("/save")
    public Utilisateur addUtilisateur(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.saveUtilisateur(utilisateur);
    }

    // ❌ Supprimer un utilisateur
    @DeleteMapping("/delete/{id}")
    public void deleteUtilisateurById(@PathVariable(name = "id") Long id) {
        utilisateurService.deleteUtilisateurById(id);
    }
}
