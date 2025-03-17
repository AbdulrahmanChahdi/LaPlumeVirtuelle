package com.example.laplumevirtuel.entities;


import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Categorie {
	
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id_catégorie;
    private String genre;

    @OneToMany(mappedBy ="categorie")
    private Set<Livre>livres;
   
}
