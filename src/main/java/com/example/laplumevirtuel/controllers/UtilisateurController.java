package com.example.laplumevirtuel.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.services.UtilisateurService;

@RestController
@RequestMapping("/utilisateurs")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    public List<Utilisateur> getAllUsers() {
        return utilisateurService.findAllUsers();
    }

    @GetMapping("/{id}")
    public Utilisateur getUserById(@PathVariable long id) {
        return utilisateurService.findUserById(id);
    }

    @PostMapping
    public Utilisateur createUser(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.saveOrUpdateUser(utilisateur);
    }

    @PutMapping
    public Utilisateur updateUser(@RequestBody Utilisateur utilisateur) {
        return utilisateurService.saveOrUpdateUser(utilisateur);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable long id) {
        utilisateurService.deleteUser(id);
    }
}
