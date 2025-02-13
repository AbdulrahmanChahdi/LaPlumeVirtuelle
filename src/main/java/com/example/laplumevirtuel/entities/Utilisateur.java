package com.example.laplumevirtuel.entities;

import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinTable;
import jakarta.persistence.*;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String nom;
    private String adresse_mail;
    private String adresse_postal;
    private String tel;
    private String date_inscription;
    private String rôle;
    
    @OneToMany(mappedBy = "utilisateur")
    private Set<Abonnement>abonnements;

    @OneToMany(mappedBy = "utilisateur")
    private Set<Commentaire>commentaires;
    
    @ManyToMany
    @JoinTable(
        name = "utilisateur_podcast_ecouter",
        joinColumns = @JoinColumn(name = "id_utilisateur"),
        inverseJoinColumns = @JoinColumn(name = "id_podcast")
    )
    private Set<Podcast> podcastsEcoutés;
    
    @ManyToMany
    @JoinTable(
        name = "utilisateur_podcast_telecharger",
        joinColumns = @JoinColumn(name = "id_utilisateur"),
        inverseJoinColumns = @JoinColumn(name = "id_podcast")
    )
    private Set<Podcast> podcastsTelechargés;
    
    @ManyToMany
    @JoinTable(
        name = "utilisateur_livre_audio_ecouter",
        joinColumns = @JoinColumn(name = "id_utilisateur"),
        inverseJoinColumns = @JoinColumn(name = "id_livre_audio")
    )
    private Set<LivreAudio> livresAudioEcoutés;

    @ManyToMany
    @JoinTable(
        name = "utilisateur_livre_audio_telecharger",
        joinColumns = @JoinColumn(name = "id_utilisateur"),
        inverseJoinColumns = @JoinColumn(name = "id_livre_audio")
    )
    private Set<LivreAudio> livresAudioTelechargés;
    
    @ManyToMany
    @JoinTable(
        name = "utilisateur_livre_emprunter",
        joinColumns = @JoinColumn(name = "id_utilisateur"),
        inverseJoinColumns = @JoinColumn(name = "id_livre")
    )
    private Set<Livre> livresEmpruntés;

    @ManyToMany
    @JoinTable(
        name = "utilisateur_livre_acheter",
        joinColumns = @JoinColumn(name = "id_utilisateur"),
        inverseJoinColumns = @JoinColumn(name = "id_livre")
    )
    private Set<Livre> livresAchetés;
    
}
