# La Plume Virtuelle

## Description
**La Plume Virtuelle** est une bibliothèque en ligne qui permet aux utilisateurs d'accéder à des livres, des livres audio et des podcasts. La plateforme offre diverses fonctionnalités telles que l'achat, l'emprunt, l'écoute et le téléchargement de contenu, ainsi qu'un système de commentaires et d'abonnements.

## Fonctionnalités principales
- Gestion des utilisateurs (inscription, authentification, abonnements)
- Ajout et gestion des livres et livres audio
- Écoute et téléchargement de podcasts
- Ajout et gestion des commentaires
- Gestion des auteurs, éditeurs et catégories

## Technologies utilisées
- **Backend** : Spring Boot (Java, JPA, Hibernate)
- **Base de données** : H2 (pour le développement) ou PostgreSQL/MySQL en production
- **Frontend** : Angular (prévu pour l'intégration future)
- **Gestion des dépendances** : Maven

## Prérequis
Avant d'exécuter ce projet, assurez-vous d'avoir installé :
- **JDK 17** ou une version compatible
- **Maven**
- **Spring Boot**
- **Base de données PostgreSQL/MySQL (optionnelle)**

## Architecture du projet
```
la-plume-virtuelle/
│── src/
│   ├── main/
│   │   ├── java/com/example/laplumevirtuel/
│   │   │   ├── entities/       # Modèles de données
│   │   │   ├── repository/     # Accès aux données (JPA Repositories)
│   │   │   ├── config/         # Configuration de l'application
│   │   │   ├── services/       # Services métier
│   │   │   ├── controllers/    # API REST
│   │   ├── resources/
│   │   │   ├── application.properties  # Configuration
│── pom.xml  # Fichier de gestion des dépendances Maven
```

## API REST
L'application expose plusieurs endpoints REST via **Spring Boot REST API**.

| Ressource       | Endpoint                  | Méthode | Description |
|----------------|--------------------------|---------|-------------|
| Utilisateurs   | `/api/utilisateurs`       | GET     | Liste des utilisateurs |
| Utilisateur    | `/api/utilisateurs/{id}`  | GET     | Détails d'un utilisateur |
| Livres         | `/api/livres`             | GET     | Liste des livres |
| Livre          | `/api/livres/{id}`        | GET     | Détails d'un livre |
| Podcasts       | `/api/podcasts`           | GET     | Liste des podcasts |
| Podcast        | `/api/podcasts/{id}`      | GET     | Détails d'un podcast |

## Données de test
L'application utilise un **DataInitializer** pour pré-remplir la base de données avec des utilisateurs, livres et podcasts fictifs.

## Contribuer
Si vous souhaitez contribuer :
1. Forker le projet
2. Créer une branche (`git checkout -b feature-nouvelle-fonctionnalité`)
3. Commiter vos changements (`git commit -m 'Ajout de la fonctionnalité X'`)
4. Pousser la branche (`git push origin feature-nouvelle-fonctionnalité`)
5. Ouvrir une Pull Request

## Licence
Ce projet est sous licence MIT.

## Auteurs
Développé par **Chahdi Abdulrahman & Mansouri Youcef**
