package com.example.laplumevirtuel.web;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.access.prepost.PreAuthorize;

import com.example.laplumevirtuel.dto.UserDTO;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.services.UtilisateurService;

@RestController
@RequestMapping("/api/utilisateurs")
@CrossOrigin(origins = { "http://localhost:4200", "http://localhost:5173", "http://localhost:5174" })
public class UtilisateurController {

  @Autowired
  UtilisateurService utilisateurService;

  @GetMapping("/test")
  public String test() {
    return "Api Functional ok";
  }

  @GetMapping("/all")
  @PreAuthorize("hasRole('ADMIN')")
  public List<UserDTO> getAUtilisateurs() {
    return utilisateurService.getAllUtilisateurs().stream()
        .map(this::mapToDTO)
        .collect(Collectors.toList());
  }

  @GetMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public UserDTO getUtilisateur(@PathVariable(name = "id") Long id) {
    return mapToDTO(utilisateurService.getUtilisateursById(id));

  }

  @PostMapping("/save")
  @PreAuthorize("hasRole('ADMIN')")
  public UserDTO addUtilisateur(@RequestBody Utilisateur utilisateur) {
    return mapToDTO(utilisateurService.saveUtilisateur(utilisateur));
  }

  @DeleteMapping("/delete/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public void deleteUtilisateurById(@PathVariable(name = "id") Long id) {
    utilisateurService.deleteUtilisateurById(id);
  }

  private UserDTO mapToDTO(Utilisateur utilisateur) {
    if (utilisateur == null) {
      return null;
    }

    return new UserDTO(
        utilisateur.getId(),
        utilisateur.getNom(),
        utilisateur.getAdresseMail(),
        utilisateur.getAdressePostal(),
        utilisateur.getTel(),
        utilisateur.getRole(),
        utilisateur.getDateInscription());
  }

}
