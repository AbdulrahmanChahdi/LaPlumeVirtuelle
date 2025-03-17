package com.example.laplumevirtuel.config;

import com.example.laplumevirtuel.entities.*;
import com.example.laplumevirtuel.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AbonnementRepository abonnementRepository;
    private final AuteurRepository auteurRepository;
    private final CategorieRepository categorieRepository;
    private final CommentaireRepository commentaireRepository;
    private final EditeurRepository editeurRepository;
    private final LivreRepository livreRepository;
    private final LivreAudioRepository livreAudioRepository;
    private final PodcastRepository podcastRepository;
    private final UtilisateurRepository utilisateurRepository;

    public DataInitializer(
            AbonnementRepository abonnementRepository,
            AuteurRepository auteurRepository,
            CategorieRepository categorieRepository,
            CommentaireRepository commentaireRepository,
            EditeurRepository editeurRepository,
            LivreRepository livreRepository,
            LivreAudioRepository livreAudioRepository,
            PodcastRepository podcastRepository,
            UtilisateurRepository utilisateurRepository) {
        this.abonnementRepository = abonnementRepository;
        this.auteurRepository = auteurRepository;
        this.categorieRepository = categorieRepository;
        this.commentaireRepository = commentaireRepository;
        this.editeurRepository = editeurRepository;
        this.livreRepository = livreRepository;
        this.livreAudioRepository = livreAudioRepository;
        this.podcastRepository = podcastRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public void run(String... args) throws Exception {

        // Création des utilisateurs
        Utilisateur user1 = new Utilisateur(null, "Alice Dupont", "alice@example.com", "password123", "Paris", "0601020304", "2024-03-01", "USER", null, null, null, null, null, null, null, null);
        Utilisateur user2 = new Utilisateur(null, "Bob Martin", "bob@example.com", "securepass", "Lyon", "0612345678", "2024-03-02", "USER", null, null, null, null, null, null, null, null);

        utilisateurRepository.saveAll(List.of(user1, user2));

        // Création des auteurs
        Auteur auteur1 = new Auteur(null, "Victor Hugo", "1802-02-26", "Écrivain français emblématique.", null);
        Auteur auteur2 = new Auteur(null, "J.K. Rowling", "1965-07-31", "Créatrice de la saga Harry Potter.", null);

        auteurRepository.saveAll(List.of(auteur1, auteur2));

        // Création des catégories
        Categorie cat1 = new Categorie(null, "Roman", null);
        Categorie cat2 = new Categorie(null, "Science-Fiction", null);

        categorieRepository.saveAll(List.of(cat1, cat2));

        // Création des éditeurs
        Editeur editeur1 = new Editeur(null, "Gallimard", "Paris, France", "www.gallimard.fr", "1911", null);
        Editeur editeur2 = new Editeur(null, "Hachette", "Paris, France", "www.hachette.fr", "1826", null);

        editeurRepository.saveAll(List.of(editeur1, editeur2));

        // Création des livres
        Livre livre1 = new Livre(null, "Les Misérables", "1862", "Français", "Un grand roman social.", true, 1500, cat1, auteur1, null, Set.of(editeur1), null);
        Livre livre2 = new Livre(null, "Harry Potter à l'école des sorciers", "1997", "Anglais", "Le début d'une saga magique.", true, 350, cat2, auteur2, null, Set.of(editeur2), null);

        livreRepository.saveAll(List.of(livre1, livre2));

        // Création des livres audio
        LivreAudio livreAudio1 = new LivreAudio(null, "Les Misérables", "Jean Rochefort", 3.45, "MP3", 500, null, null);
        LivreAudio livreAudio2 = new LivreAudio(null, "Harry Potter", "Bernard Giraudeau", 2.30, "MP3", 450, null, null);

        livreAudioRepository.saveAll(List.of(livreAudio1, livreAudio2));

        // Création des podcasts
        Podcast podcast1 = new Podcast(null, "Littérature et Passion", 45, "Littérature", "Alice Dupont", null, null);
        Podcast podcast2 = new Podcast(null, "Science et Fiction", 50, "Science-Fiction", "Bob Martin", null, null);

        podcastRepository.saveAll(List.of(podcast1, podcast2));

        // Création des abonnements
        Abonnement abo1 = new Abonnement(null, 9.99, "Mensuel", "2024-03-01", "2024-04-01", user1);
        Abonnement abo2 = new Abonnement(null, 99.99, "Annuel", "2024-03-01", "2025-03-01", user2);

        abonnementRepository.saveAll(List.of(abo1, abo2));

        // Création des commentaires
        Commentaire com1 = new Commentaire(null, "Super livre, très inspirant !", "2024-03-05", 5L, user1);
        Commentaire com2 = new Commentaire(null, "J'ai adoré l'univers de Harry Potter !", "2024-03-06", 4L, user2);

        commentaireRepository.saveAll(List.of(com1, com2));

        System.out.println("Données initialisées avec succès !");
    }
}
