package com.example.laplumevirtuel.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.laplumevirtuel.entities.Livre;

public interface LivreRepository extends JpaRepository<Livre, Long> {

}
