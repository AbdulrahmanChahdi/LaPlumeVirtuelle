package com.example.laplumevirtuel.entities;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
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
    
    private Long id;
    private String nom;
    private String adresse_mail;
    private String motDePasse;
    private String adresse_postal;
    private String tel;
    private String date_inscription;
    private String rôle;
    
    @JsonIgnore
    @OneToMany(mappedBy = "utilisateur")
     private Set<Abonnement>abonnements;
    
    @JsonIgnore
    @OneToMany (mappedBy = "utilisateur")
    private Set<Commentaire>commentaires;

    @JsonIgnore
    @ManyToMany
    @JoinTable
    (name= "Ecouter_Podcast",
    joinColumns = @JoinColumn(name= "id_utilisateur"),
    inverseJoinColumns = @JoinColumn(name = "id_podcast")
    )
    private Set<Podcast> podcastsEcoutés;
    
    @JsonIgnore
    @ManyToMany 
    @JoinTable 
    (name ="Télecharger_podcast",
     joinColumns = @JoinColumn(name = "id_utilisateur"),
    inverseJoinColumns= @JoinColumn(name = "id_podcast")
    )
    private Set <Podcast> podcastsTelecharger;
    
    @JsonIgnore
    @ManyToMany
    @JoinTable
    (name = "Ecouter_Livre",
    joinColumns = @JoinColumn(name = "id_utilisateur"),
    inverseJoinColumns = @JoinColumn (name = "id_livre_audio")
    )
    private Set<LivreAudio> livresAudiosEcouter;
   
    @JsonIgnore
    @ManyToMany
    @JoinTable
    (name = "Telecharger_Livre_Audio", 
    joinColumns = @JoinColumn( name= "id_utilisateur"),
    inverseJoinColumns = @JoinColumn(name = "id_livre_audio")
    )
    private Set<LivreAudio>livresAudiosTelecharger;
    
    @JsonIgnore
    @ManyToMany
    @JoinTable
    (name = "Acheter_Livre",
    joinColumns = @JoinColumn(name = "id_utilisateur"),
    inverseJoinColumns = @JoinColumn(name = "id_livre")
    )
    private Set<Livre>LivresTelecharger;
    
    @JsonIgnore
	@ManyToMany
	@JoinTable
	(name = "Emprunter_Livre",
	joinColumns =  @JoinColumn(name = "lecteur_id"),
	inverseJoinColumns =  @JoinColumn(name = "utilisateur_id")	
	)
	private Set<Livre> UtilisateursEmprunt;
}
