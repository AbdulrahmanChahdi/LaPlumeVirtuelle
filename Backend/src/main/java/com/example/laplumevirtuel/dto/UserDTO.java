package com.example.laplumevirtuel.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String nom;
    private String adresseMail;
    private String adressePostal;
    private String tel;
    private String role;
    private LocalDateTime dateInscription;
}
