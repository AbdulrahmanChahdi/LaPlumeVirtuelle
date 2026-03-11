package com.example.laplumevirtuel.repository;

import com.example.laplumevirtuel.entities.Categorie;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CategorieRepository extends JpaRepository<Categorie, Long> {
	Optional<Categorie> findByNomIgnoreCase(String nom);

}
