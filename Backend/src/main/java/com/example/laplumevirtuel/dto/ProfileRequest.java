package com.example.laplumevirtuel.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileRequest {

    private String ageRange;

    @NotEmpty(message = "Au moins un objectif est requis")
    @Size(max = 6, message = "Vous pouvez selectionner au maximum 6 objectifs")
    private List<@NotBlank(message = "Chaque objectif doit etre renseigne") String> objectives;

    @NotEmpty(message = "Au moins un format est requis")
    @Size(max = 5, message = "Vous pouvez selectionner au maximum 5 formats")
    private List<@NotBlank(message = "Chaque format doit etre renseigne") String> formats;

    @NotEmpty(message = "Au moins un genre est requis")
    @Size(max = 10, message = "Vous pouvez selectionner au maximum 10 genres")
    private List<@NotBlank(message = "Chaque genre doit etre renseigne") String> genres;

    private String readingLevel;

    private String sessionTime;

    private List<@NotBlank(message = "Chaque moment doit etre renseigne") String> moments;

    private String discoveryPreference;

    @NotNull(message = "Le consentement doit etre fourni")
    private Boolean consent;

    private String favorites;

    private String tasteDescription;

    @NotNull(message = "Le texte libre doit etre fourni (peut etre vide)")
    @Size(max = 2000, message = "Le texte libre ne peut pas depasser 2000 caracteres")
    private String texteLibre;
}
