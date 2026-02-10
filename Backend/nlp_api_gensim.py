"""
API Flask pour le système de recommandation NLP avec Gensim
Expose les fonctionnalités du moteur NLP Doc2Vec via HTTP
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
import os
from gensim_training import GensimRecommendationEngine

app = Flask(__name__)
CORS(app)  # Activer CORS pour les requêtes cross-origin

# Initialiser le moteur Gensim
print("🚀 Initialisation du moteur NLP Gensim...")
engine = GensimRecommendationEngine()

# Charger le modèle si il existe, sinon entraîner un nouveau modèle
model_path = "gensim_recommendation_model.pkl"
if os.path.exists(model_path):
    print(f"📦 Chargement du modèle existant: {model_path}")
    try:
        engine.load_model(model_path)
        print("✅ Modèle chargé avec succès")
    except Exception as e:
        print(f"❌ Erreur lors du chargement: {e}")
        print("🔄 Entraînement d'un nouveau modèle...")
        engine.load_data()
        documents = engine.prepare_documents()
        engine.train_model(documents, vector_size=100, epochs=40)
        engine.save_model(model_path)
else:
    print(f"⚠️  Aucun modèle trouvé. Entraînement requis...")
    print("📝 Chargement des données et entraînement...")
    engine.load_data()
    documents = engine.prepare_documents()
    engine.train_model(documents, vector_size=100, epochs=40)
    engine.save_model(model_path)

print("✨ Moteur NLP prêt!")


@app.route('/health', methods=['GET'])
def health():
    """Endpoint de santé de l'API"""
    stats = engine.get_model_stats()
    return jsonify({
        'status': 'ok',
        'message': 'Moteur NLP Gensim actif',
        'model_loaded': engine.model is not None,
        'stats': stats
    })


@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """
    Endpoint pour obtenir des recommandations
    
    Body JSON:
    {
        "tranche_age": "25-34",
        "objectif": "apprendre,seDivertir",
        "format": "livre,livreAudio",
        "thematique": "fiction,science",
        "niveau_lecture": "intermediaire",
        "frequence_lecture": "30-60",
        "moment_consomation": "matin,soir",
        "auteur_prefere": "Asimov",
        "description": "J'aime la science-fiction",
        "decouvertePrefrence": "mix",
        "RGPD": true,
        "num_recommendations": 5
    }
    
    Returns:
    {
        "success": true,
        "count": 5,
        "recommendations": [
            {
                "product": "Le Guide du voyageur galactique",
                "score": 0.85,
                "match_percentage": "85%"
            }
        ]
    }
    """
    try:
        # Récupérer les données JSON
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Aucune donnée fournie'
            }), 400
        
        # Vérifier que le modèle est chargé
        if not engine.model:
            return jsonify({
                'success': False,
                'error': 'Modèle non chargé. Veuillez entraîner le modèle d\'abord.'
            }), 503
        
        # Extraire le nombre de recommandations
        num_recs = data.pop('num_recommendations', 5)
        
        # Obtenir les recommandations
        recommendations = engine.get_recommendations(data, top_n=num_recs)
        
        # Convertir en JSON
        result = {
            'success': True,
            'count': len(recommendations),
            'recommendations': recommendations[:num_recs]
        }
        
        return jsonify(result), 200
    
    except Exception as e:
        print(f"❌ Erreur lors du traitement: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/recommendations/detailed', methods=['POST'])
def get_recommendations_detailed():
    """
    Endpoint pour obtenir des recommandations détaillées
    Retourne les mêmes recommandations avec plus de détails
    """
    try:
        data = request.get_json()
        
        if not engine.model:
            return jsonify({
                'success': False,
                'error': 'Modèle non chargé'
            }), 503
        
        num_recs = data.pop('num_recommendations', 10)
        
        recommendations = engine.get_recommendations(data, top_n=num_recs)
        
        result = {
            'success': True,
            'count': len(recommendations),
            'user_profile': {
                'tranche_age': data.get('tranche_age'),
                'objectif': data.get('objectif'),
                'format': data.get('format'),
                'thematique': data.get('thematique'),
                'niveau_lecture': data.get('niveau_lecture')
            },
            'recommendations': recommendations[:num_recs]
        }
        
        return jsonify(result), 200
    
    except Exception as e:
        print(f"❌ Erreur lors du traitement détaillé: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Endpoint pour obtenir les statistiques du modèle"""
    try:
        stats = engine.get_model_stats()
        
        if not stats:
            return jsonify({
                'success': False,
                'error': 'Modèle non chargé'
            }), 503
        
        return jsonify({
            'success': True,
            'stats': stats
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/train', methods=['POST'])
def train_model():
    """
    Endpoint pour réentraîner le modèle
    Optionnel: peut accepter des paramètres de configuration
    """
    try:
        data = request.get_json() or {}
        
        # Paramètres d'entraînement
        vector_size = data.get('vector_size', 100)
        epochs = data.get('epochs', 40)
        window = data.get('window', 5)
        
        print(f"🔄 Démarrage de l'entraînement...")
        print(f"   Vector size: {vector_size}")
        print(f"   Epochs: {epochs}")
        print(f"   Window: {window}")
        
        # Charger les données
        engine.load_data()
        
        # Préparer les documents
        documents = engine.prepare_documents()
        
        # Entraîner
        engine.train_model(
            documents,
            vector_size=vector_size,
            window=window,
            epochs=epochs
        )
        
        # Sauvegarder
        engine.save_model()
        
        # Stats
        stats = engine.get_model_stats()
        
        return jsonify({
            'success': True,
            'message': 'Modèle entraîné avec succès',
            'stats': stats
        }), 200
        
    except Exception as e:
        print(f"❌ Erreur lors de l'entraînement: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/test', methods=['POST'])
def test_model():
    """
    Endpoint de test avec un profil prédéfini
    """
    try:
        if not engine.model:
            return jsonify({
                'success': False,
                'error': 'Modèle non chargé'
            }), 503
        
        # Profil de test
        test_profile = {
            'tranche_age': '25-34',
            'objectif': 'apprendre;seDivertir',
            'format': 'livre;livreAudio',
            'thematique': 'science;fiction;tech',
            'niveau_lecture': 'intermediaire',
            'frequence_lecture': '30-60',
            'moment_consomation': 'soir;weekend',
            'auteur_prefere': 'Isaac Asimov',
            'description': 'Science-fiction épique avec des concepts avancés',
            'decouvertePrefrence': 'mix'
        }
        
        # Obtenir les recommandations
        recommendations = engine.get_recommendations(test_profile, top_n=5)
        
        return jsonify({
            'success': True,
            'test_profile': test_profile,
            'recommendations': recommendations
        }), 200
        
    except Exception as e:
        print(f"❌ Erreur lors du test: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/similar-profiles', methods=['POST'])
def get_similar_profiles():
    """
    Trouver les profils similaires à un profil donné
    Utile pour le debugging et l'analyse
    """
    try:
        data = request.get_json()
        
        if not engine.model:
            return jsonify({
                'success': False,
                'error': 'Modèle non chargé'
            }), 503
        
        # Générer le vecteur pour le profil
        user_vector = engine.infer_vector(data)
        
        # Trouver les profils similaires
        from sklearn.metrics.pairwise import cosine_similarity
        similarities = {}
        
        for profile_id, profile_vector in engine.profile_vectors.items():
            similarity = cosine_similarity(
                user_vector.reshape(1, -1),
                profile_vector.reshape(1, -1)
            )[0][0]
            similarities[profile_id] = float(similarity)
        
        # Trier par similarité
        sorted_profiles = sorted(
            similarities.items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]
        
        result = {
            'success': True,
            'similar_profiles': [
                {
                    'profile_id': pid,
                    'similarity': sim,
                    'match_percentage': f"{int(sim * 100)}%"
                }
                for pid, sim in sorted_profiles
            ]
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"❌ Erreur lors de la recherche de profils: {str(e)}")
        traceback.print_exc()
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


if __name__ == '__main__':
    print("\n" + "=" * 80)
    print("🚀 DÉMARRAGE DE L'API NLP GENSIM")
    print("=" * 80)
    print("\n📡 Serveur démarré sur http://localhost:5000")
    print("\n📚 Endpoints disponibles:")
    print("   GET  /health                          - Statut de l'API")
    print("   POST /api/recommendations             - Obtenir des recommandations")
    print("   POST /api/recommendations/detailed    - Recommandations détaillées")
    print("   GET  /api/stats                       - Statistiques du modèle")
    print("   POST /api/train                       - Réentraîner le modèle")
    print("   POST /api/test                        - Tester avec un profil type")
    print("   POST /api/similar-profiles            - Trouver des profils similaires")
    print("\n" + "=" * 80 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
