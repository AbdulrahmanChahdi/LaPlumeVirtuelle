package com.example.laplumevirtuel.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Preference {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id_preference;

    @JsonProperty("tranche_age")
    private String trancheAge;
    
    private String objectif;
    private String format;
    private String thematique;
    
    @JsonProperty("niveau_lecture")
    private String niveauLecture;

    @JsonProperty("frequence_lecture")
    private String frequenceLecture;
    
    @JsonProperty("moment_consomation")
    private String momentConsomation;
    
    @JsonProperty("auteur_prefere")
    private String auteurPrefere;
    
    @JsonProperty("description")
    private String goutUtilisateur;
    
    @JsonProperty("continue_nouveau")
    private String continueNouveau;
    
    @JsonProperty("RGPD")
    private Boolean RGPD;

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
