package com.example.laplumevirtuel.entities;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
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
@ToString(exclude = {"livre", "utilisateurEcouteLivre"})
public class LivreAudio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String duree;
    private String narrateur;
    private String audioUrl;
    
    @OneToOne
    private Livre livre;

    @JsonIgnore
    @ManyToMany(mappedBy = "livresAudiosEcouter")
    private Set<Utilisateur> utilisateurEcouteLivre;
}
