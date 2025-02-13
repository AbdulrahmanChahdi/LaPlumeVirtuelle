package com.example.laplumevirtuel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.laplumevirtuel.entities.Auteur;

public interface AuteurRepository extends JpaRepository<Auteur, Long> {

}
