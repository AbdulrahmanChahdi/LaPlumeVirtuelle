package com.example.laplumevirtuel.entities;

import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class LivreAudio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private long id;
    private String nom_livre;
    private String narrateur;
    private double durée_livre;
    private String format;
    private double taille;
    
    @ManyToMany(mappedBy = "livresAudioEcoutés")
    private Set<Utilisateur> utilisateursEcoute;

    @ManyToMany(mappedBy = "livresAudioTelechargés")
    private Set<Utilisateur> utilisateursTelecharge;


}
