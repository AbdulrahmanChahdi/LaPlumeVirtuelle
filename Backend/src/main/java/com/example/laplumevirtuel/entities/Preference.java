package com.example.laplumevirtuel.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Preference {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id_preference;

    @JsonProperty("tranche_age")
    @NotBlank(message = "La tranche d'âge ne peut pas être vide")
    private String trancheAge;
    
    @NotBlank(message = "L'objectif ne peut pas être vide")
    private String objectif;
    
    @NotBlank(message = "Le format ne peut pas être vide")
    private String format;
    
    @NotBlank(message = "La thématique ne peut pas être vide")
    private String thematique;
    
    @JsonProperty("niveau_lecture")
    @NotBlank(message = "Le niveau de lecture ne peut pas être vide")
    private String niveauLecture;

    @JsonProperty("frequence_lecture")
    @NotBlank(message = "La fréquence de lecture ne peut pas être vide")
    private String frequenceLecture;
    
    @JsonProperty("moment_consomation")
    @NotBlank(message = "Le moment de consommation ne peut pas être vide")
    private String momentConsomation;
    
    @JsonProperty("auteur_prefere")
    private String auteurPrefere;
    
    @JsonProperty("description")
    private String goutUtilisateur;
    
    @JsonProperty("decouvertePrefrence")
    @Enumerated(EnumType.STRING)
    @NotNull(message = "La préférence de découverte ne peut pas être vide")
    private decouvertePrefrence decouvertePrefrence;
    
    @JsonProperty("RGPD")
    @NotNull(message = "Le consentement RGPD doit être fourni")
    private Boolean RGPD;

    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToOne
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    public enum decouvertePrefrence{
        decouverte,
        habitudes,
        mix,
    }

    public enum tranche_age {
        de_13_a_17_ans,
        de_18_a_24_ans,
        de_25_a_34_ans,
        de_35_a_44_ans,
        de_45_a_54_ans,
        plus_de_55_ans,
    }

    public enum frequence_lecture {
        de_5_a_10_MIN_PAR_JOUR,
        de_10_a_20_MIN_PAR_JOUR,
        de_20_a_30_MIN_PAR_JOUR,
        de_30_a_60_MIN_PAR_JOUR,
        plus_de_60_MIN_PAR_JOUR,
    }
    
}
