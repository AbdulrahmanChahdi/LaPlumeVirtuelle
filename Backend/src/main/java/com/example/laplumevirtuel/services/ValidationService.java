package com.example.laplumevirtuel.services;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.example.laplumevirtuel.entities.Abonnement;
import com.example.laplumevirtuel.entities.Livre;
import com.example.laplumevirtuel.entities.Utilisateur;

@Service
public class ValidationService {

    /**
     * Vérifie si un utilisateur a un abonnement actif
     * 
     * @param utilisateur l'utilisateur à vérifier
     * @return true si l'utilisateur a au moins un abonnement actif
     */
    public boolean hasActiveSubscription(Utilisateur utilisateur) {
        if (utilisateur == null || utilisateur.getAbonnements() == null || utilisateur.getAbonnements().isEmpty()) {
            return false;
        }

        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return utilisateur.getAbonnements().stream()
                .anyMatch(abonnement -> isSubscriptionActive(abonnement, today, formatter));
    }

    /**
     * Vérifie si un abonnement spécifique est actif
     * 
     * @param abonnement l'abonnement à vérifier
     * @return true si l'abonnement est actif
     */
    public boolean isSubscriptionActive(Abonnement abonnement) {
        if (abonnement == null) {
            return false;
        }

        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return isSubscriptionActive(abonnement, today, formatter);
    }

    /**
     * Méthode interne pour vérifier si un abonnement est actif à une date donnée
     */
    private boolean isSubscriptionActive(Abonnement abonnement, LocalDate referenceDate, DateTimeFormatter formatter) {
        try {
            if (abonnement.getDate_debut() == null || abonnement.getDate_fin() == null) {
                return false;
            }

            LocalDate dateDebut = LocalDate.parse(abonnement.getDate_debut(), formatter);
            LocalDate dateFin = LocalDate.parse(abonnement.getDate_fin(), formatter);

            return !referenceDate.isBefore(dateDebut) && !referenceDate.isAfter(dateFin);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Vérifie si un livre est disponible pour l'emprunt
     * 
     * @param livre le livre à vérifier
     * @return true si le livre est disponible
     */
    public boolean isBookAvailable(Livre livre) {
        if (livre == null) {
            return false;
        }
        return livre.isDisponible();
    }

    /**
     * Valide qu'un utilisateur peut emprunter un livre
     * 
     * @param utilisateur l'utilisateur
     * @param livre       le livre
     * @throws RuntimeException si la validation échoue
     */
    public void validateBookBorrow(Utilisateur utilisateur, Livre livre) {
        if (utilisateur == null) {
            throw new RuntimeException("L'utilisateur est requis");
        }

        if (livre == null) {
            throw new RuntimeException("Le livre est requis");
        }

        if (!hasActiveSubscription(utilisateur)) {
            throw new RuntimeException("Vous devez avoir un abonnement actif pour emprunter des livres");
        }

        if (!isBookAvailable(livre)) {
            throw new RuntimeException("Ce livre n'est pas disponible à l'emprunt");
        }
    }
}
