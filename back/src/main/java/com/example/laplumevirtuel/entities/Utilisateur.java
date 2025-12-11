package com.example.laplumevirtuel.entities;

import java.util.Set;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "utilisateurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"abonnements", "commentaires", "podcastsEcoutes", "livresAchetes", "livresEmpruntes", "livresAudiosEcouter", "livresAudiosTelecharger"})
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(name = "adresse_mail", nullable = false, unique = true)
    private String adresseMail;

    @Column(name = "mot_de_passe", nullable = false)
    private String motDePasse;

    @Column(name = "adresse_postal")
    private String adressePostal;

    @Column(name = "tel")
    private String tel;

    @Column(name = "date_inscription")
    private LocalDateTime dateInscription = LocalDateTime.now();

    @Column(nullable = false)
    private String role = "USER";
    
    @JsonIgnore
    @OneToMany(mappedBy = "utilisateur")
    private Set<Abonnement> abonnements;
    
    @JsonIgnore
    @OneToMany(mappedBy = "utilisateur")
    private Set<Commentaire> commentaires;

    @ManyToMany
    @JoinTable(
        name = "utilisateur_podcasts_ecoutes",
        joinColumns = @JoinColumn(name = "utilisateur_id"),
        inverseJoinColumns = @JoinColumn(name = "podcast_id")
    )
    private Set<Podcast> podcastsEcoutes;
    
    @ManyToMany
    @JoinTable(
        name = "utilisateur_livres_achetes",
        joinColumns = @JoinColumn(name = "utilisateur_id"),
        inverseJoinColumns = @JoinColumn(name = "livre_id")
    )
    private Set<Livre> livresAchetes;
    
    @ManyToMany
    @JoinTable(
        name = "utilisateur_livres_empruntes",
        joinColumns = @JoinColumn(name = "utilisateur_id"),
        inverseJoinColumns = @JoinColumn(name = "livre_id")
    )
    private Set<Livre> livresEmpruntes;

    @ManyToMany
    @JoinTable(
        name = "utilisateur_livres_audios_ecoutes",
        joinColumns = @JoinColumn(name = "utilisateur_id"),
        inverseJoinColumns = @JoinColumn(name = "livre_audio_id")
    )
    private Set<LivreAudio> livresAudiosEcouter;

    @ManyToMany
    @JoinTable(
        name = "utilisateur_livres_audios_telecharges",
        joinColumns = @JoinColumn(name = "utilisateur_id"),
        inverseJoinColumns = @JoinColumn(name = "livre_audio_id")
    )
    private Set<LivreAudio> livresAudiosTelecharger;
}
