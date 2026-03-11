package com.example.laplumevirtuel.config;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.laplumevirtuel.entities.Auteur;
import com.example.laplumevirtuel.entities.Categorie;
import com.example.laplumevirtuel.entities.Editeur;
import com.example.laplumevirtuel.entities.Livre;
import com.example.laplumevirtuel.entities.LivreAudio;
import com.example.laplumevirtuel.entities.Podcast;
import com.example.laplumevirtuel.entities.Utilisateur;
import com.example.laplumevirtuel.repository.AuteurRepository;
import com.example.laplumevirtuel.repository.CategorieRepository;
import com.example.laplumevirtuel.repository.EditeurRepository;
import com.example.laplumevirtuel.repository.LivreAudioRepository;
import com.example.laplumevirtuel.repository.LivreRepository;
import com.example.laplumevirtuel.repository.PodcastRepository;
import com.example.laplumevirtuel.repository.UtilisateurRepository;
import com.example.laplumevirtuel.service.ReadingProgressService;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UtilisateurRepository utilisateurRepository;
    
    @Autowired
    private LivreRepository livreRepository;
    
    @Autowired
    private LivreAudioRepository livreAudioRepository;
    
    @Autowired
    private PodcastRepository podcastRepository;
    
    @Autowired
    private AuteurRepository auteurRepository;
    
    @Autowired
    private CategorieRepository categorieRepository;
    
    @Autowired
    private EditeurRepository editeurRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ReadingProgressService readingProgressService;

    @Override
    public void run(String... args) throws Exception {
        logger.info("Début de l'initialisation des données...");

        // Vérification si des données existent déjà
        if (utilisateurRepository.count() > 0) {
            logger.info("La base de données n'est pas vide. Pas d'initialisation nécessaire.");
            return;
        }

        try {
            // Création des catégories
            logger.info("Création des catégories...");
            Map<String, Categorie> categoriesByName = new HashMap<>();
            String[] categoryNames = {
                    "Fantasy",
                    "Science-Fiction",
                    "Policier / Thriller",
                    "Roman Historique",
                    "Romance",
                    "Horreur / Épouvante",
                    "Littérature Classique",
                    "Conte et Légende",
                    "Aventure",
                    "Young Adult",
                    "Biographie / Autobiographie",
                    "Essai",
                    "Développement Personnel",
                    "Histoire",
                    "Sciences",
                    "Philosophie",
                    "Religion et Spiritualité",
                    "Bande Dessinée / Manga",
                    "Poésie",
                    "Théâtre",
                    "Cuisine",
                    "Voyage",
                    "Art / Photographie",
                    "Psychologie",
                    "Économie"
            };

            for (String name : categoryNames) {
                Categorie c = new Categorie();
                c.setNom(name);
                c.setDescription("Catégorie " + name);
                categoriesByName.put(name, categorieRepository.save(c));
            }

            // Création des éditeurs
            logger.info("Création des éditeurs...");
            Editeur gallimard = new Editeur();
            gallimard.setNom("Gallimard");
            gallimard.setAdresse("5 rue Gaston Gallimard, 75007 Paris");
            gallimard.setTelephone("01 49 54 42 42");
            editeurRepository.save(gallimard);

            Editeur flammarion = new Editeur();
            flammarion.setNom("Flammarion");
            flammarion.setAdresse("87 quai Panhard et Levassor, 75013 Paris");
            flammarion.setTelephone("01 40 51 31 00");
            editeurRepository.save(flammarion);

            // Création des auteurs
            logger.info("Création des auteurs...");
            Auteur hugo = new Auteur();
            hugo.setNom("Victor Hugo");
            hugo.setBiographie("Écrivain romantique français du XIXe siècle");
            auteurRepository.save(hugo);

            Auteur verne = new Auteur();
            verne.setNom("Jules Verne");
            verne.setBiographie("Écrivain français, pionnier du roman d'aventures");
            auteurRepository.save(verne);

            // Création des utilisateurs
            logger.info("Création des utilisateurs...");
            Utilisateur admin = new Utilisateur();
            admin.setNom("Admin LPV");
            admin.setAdresseMail("admin@lpv.fr");
            admin.setMotDePasse(passwordEncoder.encode("123456789"));
            admin.setAdressePostal("1 rue Admin, 75001 Paris");
            admin.setTel("0123456789");
            admin.setRole("ADMIN");
            utilisateurRepository.save(admin);

            Utilisateur user = new Utilisateur();
            user.setNom("User");
            user.setAdresseMail("user@example.com");
            user.setMotDePasse(passwordEncoder.encode("user123"));
            user.setAdressePostal("456 rue User, 75002 Paris");
            user.setTel("9876543210");
            user.setRole("USER");
            utilisateurRepository.save(user);

            // Création des livres
            logger.info("Création des livres...");
            Livre lesMiserables = new Livre();
            lesMiserables.setTitre("Les Misérables");
            lesMiserables.setAnneeEdition("1862");
            lesMiserables.setLangue("Français");
            lesMiserables.setResume("Un chef-d'œuvre de la littérature française");
            lesMiserables.setDisponible(true);
            lesMiserables.setNombreDePage(1500);
            lesMiserables.setImageUrl("https://m.media-amazon.com/images/I/71W4ZP0-RQL._AC_UF1000,1000_QL80_.jpg");
            lesMiserables.setCategorie(categoriesByName.get("Littérature Classique"));
            lesMiserables.setAuteur(hugo);
            lesMiserables.setEditeurs(new HashSet<>(Arrays.asList(gallimard)));
            livreRepository.save(lesMiserables);

            Livre tourDuMonde = new Livre();
            tourDuMonde.setTitre("Le Tour du monde en 80 jours");
            tourDuMonde.setAnneeEdition("1873");
            tourDuMonde.setLangue("Français");
            tourDuMonde.setResume("Une aventure extraordinaire autour du monde");
            tourDuMonde.setDisponible(true);
            tourDuMonde.setNombreDePage(300);
            tourDuMonde.setImageUrl("https://m.media-amazon.com/images/I/81WvnYY9ZxL._AC_UF1000,1000_QL80_.jpg");
            tourDuMonde.setCategorie(categoriesByName.get("Aventure"));
            tourDuMonde.setAuteur(verne);
            tourDuMonde.setEditeurs(new HashSet<>(Arrays.asList(flammarion)));
            livreRepository.save(tourDuMonde);

            // Création des livres audio
            logger.info("Création des livres audio...");
            LivreAudio audioMiserables = new LivreAudio();
            audioMiserables.setTitre("Les Misérables - Version audio");
            audioMiserables.setDuree("45h");
            audioMiserables.setNarrateur("Daniel Mesguich");
            audioMiserables.setAudioUrl("https://example.com/audio/miserables.mp3");
            audioMiserables.setLivre(lesMiserables);
            livreAudioRepository.save(audioMiserables);

            LivreAudio audioTourDuMonde = new LivreAudio();
            audioTourDuMonde.setTitre("Le Tour du monde en 80 jours - Version audio");
            audioTourDuMonde.setDuree("12h");
            audioTourDuMonde.setNarrateur("Jacques Gamblin");
            audioTourDuMonde.setAudioUrl("https://example.com/audio/tourdumond.mp3");
            audioTourDuMonde.setLivre(tourDuMonde);
            livreAudioRepository.save(audioTourDuMonde);

            // Création des podcasts
            logger.info("Création des podcasts...");
            Podcast podcastScience = new Podcast();
            podcastScience.setNom("Science et Découverte");
            podcastScience.setDuree(1800); // 30 minutes en secondes
            podcastScience.setTheme("Sciences");
            podcastScience.setAnimateur("Marie Curie");
            podcastScience.setImageUrl("https://example.com/images/science-decouverte.jpg");
            podcastRepository.save(podcastScience);

            Podcast podcastHistoire = new Podcast();
            podcastHistoire.setNom("Histoires Passionnantes");
            podcastHistoire.setDuree(2400); // 40 minutes en secondes
            podcastHistoire.setTheme("Histoire");
            podcastHistoire.setAnimateur("Michel Pastoureau");
            podcastHistoire.setImageUrl("https://example.com/images/histoires-passionnantes.jpg");
            podcastRepository.save(podcastHistoire);

            Podcast podcastLitterature = new Podcast();
            podcastLitterature.setNom("Les Grands Classiques");
            podcastLitterature.setDuree(3600); // 60 minutes en secondes
            podcastLitterature.setTheme("Littérature");
            podcastLitterature.setAnimateur("François Busnel");
            podcastLitterature.setImageUrl("https://example.com/images/grands-classiques.jpg");
            podcastRepository.save(podcastLitterature);

            // La bibliothèque personnelle reste au choix de l'utilisateur
            logger.info("Aucun contenu n'est ajouté automatiquement à la bibliothèque utilisateur");

            logger.info("Initialisation des données terminée avec succès !");
        } catch (Exception e) {
            logger.error("Erreur lors de l'initialisation des données : ", e);
            throw e;
        }
    }
}
