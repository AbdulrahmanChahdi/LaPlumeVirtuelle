package com.example.laplumevirtuel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.laplumevirtuel.entities.Utilisateur;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {

}
