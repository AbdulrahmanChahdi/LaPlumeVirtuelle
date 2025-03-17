package com.example.laplumevirtuel.entities;

import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor

public class Livre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String année_edition;
    private String langue;
    private String résumé;
    private boolean disponible = false;
    private long nombre_de_page;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;
   
    
    @ManyToOne
    @JoinColumn(name = "Auteur_id")
    private Auteur auteur;
    
    @ManyToMany(mappedBy = "LivresTelecharger")
    private Set<Utilisateur>LivresAcheter;
    
    @ManyToMany
    @JoinTable
    (name = "Presenter_Livre",
    joinColumns = @JoinColumn (name = "editeur_id"),
    inverseJoinColumns = @JoinColumn (name="livre_id")
    )
    private Set <Editeur> LivresPresenter;
    
    @ManyToMany(mappedBy = "UtilisateursEmprunt")
	private Set <Utilisateur> utilisateurs;
  

}
