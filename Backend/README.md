# Backend — La Plume Virtuelle

Backend de l’application **La Plume Virtuelle**, développé en **Java avec Spring Boot**.
Il expose une API REST consommée par le frontend React.

---

##  Stack technique

* **Java** (JDK 17 ou supérieur)
* **Spring Boot**

  * Spring Web
  * Spring Data JPA / MongoDB (selon configuration)
  * Spring Security (si activé)
* **Maven**
* **Base de données**

  * MySQL / PostgreSQL (relationnelle)
  * MongoDB (si utilisé pour certaines données)
* **API REST**
* **JSON**

---

##  Structure du projet

```text
Backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com.example.laplumevirtuelle
│   │   │       ├── controller
│   │   │       ├── service
│   │   │       ├── repository
│   │   │       ├── model
│   │   │       └── config
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application.yml
│   └── test/
├── pom.xml
└── README.md
```

---

##  Lancer le projet en local

### 1️ Prérequis

* Java **17+**
* Maven **3.8+**
* Une base de données (MySQL, PostgreSQL ou MongoDB selon le projet)

Vérification :

```bash
java -version
mvn -version
```

---

### 2️ Configuration

Configurer la base de données dans :

```text
src/main/resources/application.properties
```

Exemple (MySQL) :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/laplumevirtuelle
spring.datasource.username=root
spring.datasource.password=motdepasse

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

### 3 Lancer l’application

Depuis le dossier `Backend` :

```bash
mvn clean install
mvn spring-boot:run
```

Ou directement depuis l’IDE (Eclipse / IntelliJ / VS Code).

---

### 4 Accès à l’API

Par défaut :

```text
http://localhost:8080
```

Exemple d’endpoint sur swagger :

```
http://localhost:8080/swagger-ui/index.html#/
```

---

##  Sécurité (si activée)

* Authentification via Spring Security / JWT / Keycloak (selon configuration)
* Les endpoints protégés nécessitent un token valide
* Les rôles (USER / ADMIN) contrôlent l’accès aux routes sensibles

---

##  Tests

Lancer les tests :

```bash
mvn test
```

---

##  Lien avec le frontend

Le frontend React consomme l’API exposée par ce backend.

* Frontend : **React + Vite**
* Communication via **Axios**
* Format des échanges : **JSON**

Exemple côté frontend :

```js
axios.get("http://localhost:8080/api/livres")
```

---

## Bonnes pratiques

* Architecture en couches (Controller / Service / Repository)
* DTO pour les échanges API
* Validation des données
* Gestion centralisée des erreurs
* Variables sensibles non versionnées (`.env`, `application-local.properties`)

---
##  Auteur

[**Abdulrahman Chahdi**](https://github.com/AbdulrahmanChahdi)<br>
[**Youcef Mansouri**](https://github.com/Mansouriyoucef)<br>
Projet : *La Plume Virtuelle*