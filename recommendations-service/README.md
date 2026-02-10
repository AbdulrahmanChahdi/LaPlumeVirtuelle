# Recommendations Microservice

Service Python de recommandations basé sur TF-IDF pour La Plume Virtuelle.

## 📋 Architecture

- **Framework**: Flask 3.0+
- **Algorithme**: TF-IDF (Term Frequency-Inverse Document Frequency)
- **Librairie ML**: scikit-learn 1.5.0
- **Port**: 5000

## 🚀 Installation

```bash
cd recommendations-service
pip install -r requirements.txt
```

## ▶️ Lancement

```bash
python app.py
```

Le service démarre sur `http://localhost:5000`

## 🔌 Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "service": "recommendations-service"
}
```

### Obtenir des recommandations
```http
POST /api/recommendations
Content-Type: application/json
```

**Request Body:**
```json
{
  "user_id": "U001",
  "tranche_age": "25-34",
  "objectif": "apprendre",
  "format": "livre",
  "thematique": "science",
  "niveau_lecture": "avance",
  "frequence_lecture": "30-60",
  "moment_consomation": "soir",
  "auteur_prefere": "Isaac Asimov",
  "description": "Science-fiction avec intelligence artificielle",
  "decouvertePrefrence": "mix"
}
```

**Response:**
```json
{
  "user_id": "U001",
  "recommendations": [
    "Fondation - Isaac Asimov",
    "Neuromancien - William Gibson",
    "Les Robots - Isaac Asimov"
  ],
  "num_recommendations": 3
}
```

### Entraîner le modèle
```http
POST /api/train
```

## 📊 Données d'entraînement

Le modèle utilise `Backend/user_profiles_training.csv` (100 profils utilisateurs).

## 🔗 Intégration avec le backend Java

Le backend Java Spring Boot appelle ce service via HTTP pour obtenir des recommandations personnalisées.

**CORS activé pour:**
- `http://localhost:8080` (Backend Java)
- `http://localhost:4200` (Frontend Angular legacy)
- `http://localhost:5173` (Frontend React)

## 📁 Structure

```
recommendations-service/
├── app.py                      # Point d'entrée Flask
├── requirements.txt            # Dépendances Python
├── recommendation_engine.py    # Moteur TF-IDF (TODO)
├── model_training.py          # Entraînement du modèle (TODO)
└── README.md                  # Cette documentation
```

## 🔄 Statut

- ✅ Structure Flask
- ✅ Endpoints API
- ✅ CORS configuration
- ⏳ Moteur TF-IDF (en cours)
- ⏳ Entraînement du modèle (en cours)
