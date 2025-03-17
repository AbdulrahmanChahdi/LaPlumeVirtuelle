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

public class Podcast {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nom;
    private long durée;
    private String théme;
    private String animateur;
    
    @ManyToMany(mappedBy = "podcastsEcoutés")
    private Set<Utilisateur>utilisateurEcoutePodcast;
    
    @ManyToMany(mappedBy = "podcastsTelecharger")
    private Set<Utilisateur>utilisateursTelechargePodcast;
    
   
    
    
}
