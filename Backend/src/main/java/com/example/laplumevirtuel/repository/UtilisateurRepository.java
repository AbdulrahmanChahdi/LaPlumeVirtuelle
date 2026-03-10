package com.example.laplumevirtuel.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.laplumevirtuel.entities.Utilisateur;
import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByAdresseMail(String adresseMail);
    Optional<Utilisateur> findByAdresseMailIgnoreCase(String adresseMail);
}
