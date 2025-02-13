package com.example.laplumevirtuel.services;

import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> findAllUsers() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur findUserById(long id) {
        return utilisateurRepository.findById(id).orElse(null);
    }

    public Utilisateur saveOrUpdateUser(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);
    }

    public void deleteUser(long id) {
        utilisateurRepository.deleteById(id);
    }
}
