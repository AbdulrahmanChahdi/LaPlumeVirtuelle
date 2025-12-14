
# La Plume Virtuelle

La Plume Virtuelle est une application web de bibliothèque numérique permettant la consultation de **livres numériques**, **livres audio** et **podcasts**.

Le projet est actuellement en **refonte du frontend**, passant d’un ancien frontend Angular à un **frontend React**, tout en conservant un **backend Spring Boot**.

---

##  Objectifs

- Centraliser des contenus culturels (livres, audiobooks, podcasts)
- Proposer une interface moderne et performante
- Séparer clairement frontend et backend
- Mettre en place une architecture évolutive et maintenable

---

##  Architecture (grandes lignes)

```

LaPlumeVirtuelle/
├── Backend/     → API Spring Boot
├── FrontEnd/    → Frontend React (Vite + Tailwind)
├── docs/        → Documentation et diagrammes
├── README.md
└── .gitignore

````

- `Backend/` : expose une API REST
- `FrontEnd/` : consomme l’API et gère l’interface utilisateur
- L’ancien frontend Angular est conservé **en local uniquement** et n’est pas versionné

---

##  Stack technique

### Frontend
- React (JSX)
- Vite
- React Router
- Tailwind CSS
- Axios

### Backend
- Java
- Spring Boot
- Maven
- Base de données relationnelle

---

## ▶️ Lancer le projet en local

### Frontend
```bash
cd FrontEnd
npm install
npm run dev
````

Accessible sur :

```
http://localhost:5173
```

### Backend

```bash
cd Backend
mvn clean spring-boot:run
```

API disponible sur :

```
http://localhost:8080
```

---

##  Fonctionnalités principales

* Navigation par catégories (livres, audiobooks, podcasts)
* Authentification utilisateur
* Interface utilisateur moderne
* Architecture prête pour des fonctionnalités admin

---

##  Bonnes pratiques appliquées

* Séparation Front / Back claire
* Aucun fichier généré versionné (`node_modules`, `target`, etc.)
* Routing centralisé côté frontend
* Architecture évolutive

---

## Notes

* Le projet est en développement actif
* Les fonctionnalités admin seront ajoutées progressivement
* Le frontend React remplace progressivement l’ancien frontend Angular

---

##  Auteur

[**Abdulrahman Chahdi**](https://github.com/AbdulrahmanChahdi)<br>
[**Youcef Mansouri**](https://github.com/Mansouriyoucef)<br>
Projet : *La Plume Virtuelle*

