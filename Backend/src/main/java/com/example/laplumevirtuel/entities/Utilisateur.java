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
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
    @NotBlank(message = "Le nom ne peut pas être vide")
    @Size(min = 2, max = 100, message = "Le nom doit contenir entre 2 et 100 caractères")
    private String nom;

    @Column(name = "adresse_mail", nullable = false, unique = true)
    @NotBlank(message = "L'email ne peut pas être vide")
    @Email(message = "L'email doit être valide")
    private String adresseMail;

    @Column(name = "mot_de_passe", nullable = false)
    @NotBlank(message = "Le mot de passe ne peut pas être vide")
    @Size(min = 8, message = "Le mot de passe doit contenir au moins 8 caractères")
    private String motDePasse;

    @Column(name = "adresse_postal")
    @Size(max = 20, message = "L'adresse postale ne peut pas dépasser 20 caractères")
    private String adressePostal;

    @Column(name = "tel")
    @Size(min = 6, max = 20, message = "Le téléphone doit contenir entre 6 et 20 caractères")
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
        name = "utilisateur_livres_telecharges",
        joinColumns = @JoinColumn(name = "utilisateur_id"),
        inverseJoinColumns = @JoinColumn(name = "livre_id")
    )
    private Set<Livre> livresTelecharges;
    

    @ManyToMany
    @JoinTable(
        name = "utilisateur_livres_audios_ecoutes",
        joinColumns = @JoinColumn(name = "utilisateur_id"),
        inverseJoinColumns = @JoinColumn(name = "livre_audio_id")
    )
    private Set<LivreAudio> livresAudiosEcouter;
}

   

