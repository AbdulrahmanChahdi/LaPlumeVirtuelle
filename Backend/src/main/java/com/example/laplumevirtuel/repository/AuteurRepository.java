package com.example.laplumevirtuel.repository;

import com.example.laplumevirtuel.entities.Auteur;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AuteurRepository extends JpaRepository<Auteur, Long> {
	Optional<Auteur> findByNomIgnoreCase(String nom);

}
