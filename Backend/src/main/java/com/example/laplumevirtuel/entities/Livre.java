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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"auteur", "editeurs"})
public class Livre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String anneeEdition;
    private String langue;
    private String resume;
    private boolean disponible;
    private int nombreDePage;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;
   
    @ManyToOne
    @JoinColumn(name = "auteur_id")
    private Auteur auteur;
    
    @ManyToMany
    @JoinTable(
        name = "livre_editeur",
        joinColumns = @JoinColumn(name = "livre_id"),
        inverseJoinColumns = @JoinColumn(name = "editeur_id")
    )
    private Set<Editeur> editeurs;

    @ManyToMany
    @JoinTable(
        name = "categorie_livre",
        joinColumns = @JoinColumn(name = "livre_id"),
        inverseJoinColumns = @JoinColumn(name = "categorie_id")
    )
    private Set<Categorie> categories;
}
