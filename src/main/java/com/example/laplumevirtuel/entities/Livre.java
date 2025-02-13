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
    private long id;
    private String titre;
    private String année_edition;
    private String langue;
    private String résumé;
    private boolean disponible = false;
    private long nombre_de_page;
    
    @ManyToOne
    @JoinColumn(name = "id_categorie")
    private Categorie categorie;
    
    @ManyToOne
    @JoinColumn(name="id_auteur")
    private Auteur auteur;
    
    @ManyToMany
    @JoinTable(
        name = "livre_editeur",
        joinColumns = @JoinColumn(name = "id_livre", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "id_editeur", referencedColumnName = "id")
    )
    private Set<Editeur> editeurs;
    
    @ManyToMany(mappedBy = "livresEmpruntés")
    private Set<Utilisateur> utilisateursEmprunte;

    @ManyToMany(mappedBy = "livresAchetés")
    private Set<Utilisateur> utilisateursAchete;

    
}
