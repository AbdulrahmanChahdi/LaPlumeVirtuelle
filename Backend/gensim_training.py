"""
Modèle NLP avec Gensim pour les recommandations
Entraîne un modèle Doc2Vec sur les profils utilisateurs et génère des recommandations
"""

import pandas as pd
import numpy as np
from gensim.models.doc2vec import Doc2Vec, TaggedDocument
from gensim.utils import simple_preprocess
import re
import pickle
from sklearn.metrics.pairwise import cosine_similarity
import warnings
warnings.filterwarnings('ignore')

class GensimRecommendationEngine:
    """
    Moteur de recommandation basé sur Gensim Doc2Vec
    """
    
    def __init__(self, csv_path="user_profiles_training.csv"):
        """Initialiser le moteur avec le dataset"""
        self.csv_path = csv_path
        self.df = None
        self.model = None
        self.profile_vectors = {}
        self.product_recommendations = {}
        
    def load_data(self):
        """Charger les données du CSV"""
        print("📂 Chargement des données...")
        self.df = pd.read_csv(self.csv_path)
        print(f"   ✓ {len(self.df)} profils chargés")
        return self.df
    
    def clean_text(self, text):
        """Nettoyer et normaliser le texte"""
        if pd.isna(text) or text == "":
            return ""
        text = str(text).lower()
        # Supprimer les accents
        text = re.sub(r'[àâä]', 'a', text)
        text = re.sub(r'[éèêë]', 'e', text)
        text = re.sub(r'[îï]', 'i', text)
        text = re.sub(r'[ôö]', 'o', text)
        text = re.sub(r'[ûü]', 'u', text)
        text = re.sub(r'ç', 'c', text)
        # Supprimer les caractères spéciaux
        text = re.sub(r'[^a-z0-9\s;,\-]', '', text)
        return text
    
    def prepare_documents(self):
        """
        Préparer les documents pour Doc2Vec
        Chaque profil utilisateur devient un document
        """
        print("\n📝 Préparation des documents pour Doc2Vec...")
        
        documents = []
        
        for idx, row in self.df.iterrows():
            # Combiner toutes les informations du profil en un texte
            profile_text_parts = [
                row['tranche_age'],
                row['objectif'].replace(';', ' '),
                row['format'].replace(';', ' '),
                row['thematique'].replace(';', ' '),
                row['niveau_lecture'],
                row['frequence_lecture'],
                row['moment_consomation'].replace(';', ' '),
                str(row['auteur_prefere']) if pd.notna(row['auteur_prefere']) else "",
                str(row['description']) if pd.notna(row['description']) else "",
                row['decouvertePrefrence']
            ]
            
            # Nettoyer et joindre
            profile_text = ' '.join([self.clean_text(part) for part in profile_text_parts if part])
            
            # Tokeniser avec simple_preprocess
            tokens = simple_preprocess(profile_text, deacc=True)
            
            # Créer un TaggedDocument
            doc = TaggedDocument(words=tokens, tags=[row['profile_id']])
            documents.append(doc)
            
            # Stocker les recommandations pour ce profil
            self.product_recommendations[row['profile_id']] = row['recommendations'].split('|')
        
        print(f"   ✓ {len(documents)} documents préparés")
        return documents
    
    def train_model(self, documents, vector_size=100, window=5, min_count=1, epochs=40):
        """
        Entraîner le modèle Doc2Vec
        
        Args:
            vector_size: Taille des vecteurs (100 par défaut)
            window: Fenêtre de contexte
            min_count: Fréquence minimale des mots
            epochs: Nombre d'époques d'entraînement
        """
        print(f"\n🧠 Entraînement du modèle Doc2Vec...")
        print(f"   Paramètres:")
        print(f"   - Vector size: {vector_size}")
        print(f"   - Window: {window}")
        print(f"   - Min count: {min_count}")
        print(f"   - Epochs: {epochs}")
        
        # Créer le modèle Doc2Vec
        self.model = Doc2Vec(
            vector_size=vector_size,
            window=window,
            min_count=min_count,
            workers=4,
            epochs=epochs,
            dm=1,  # PV-DM (meilleur pour les documents)
            seed=42
        )
        
        # Construire le vocabulaire
        print("   Building vocabulary...")
        self.model.build_vocab(documents)
        
        # Entraîner le modèle
        print("   Training model...")
        self.model.train(
            documents,
            total_examples=self.model.corpus_count,
            epochs=self.model.epochs
        )
        
        print("   ✅ Modèle entraîné avec succès!")
        
        # Générer les vecteurs pour tous les profils
        print("\n📊 Génération des vecteurs de profils...")
        for doc in documents:
            profile_id = doc.tags[0]
            self.profile_vectors[profile_id] = self.model.dv[profile_id]
        
        print(f"   ✓ {len(self.profile_vectors)} vecteurs générés")
        
        return self.model
    
    def infer_vector(self, user_preferences):
        """
        Générer un vecteur pour un nouveau profil utilisateur
        
        Args:
            user_preferences: Dict avec les réponses du formulaire
        
        Returns:
            numpy array (vecteur)
        """
        # Construire le texte du profil
        profile_text_parts = [
            user_preferences.get('tranche_age', ''),
            user_preferences.get('objectif', '').replace(',', ' ').replace(';', ' '),
            user_preferences.get('format', '').replace(',', ' ').replace(';', ' '),
            user_preferences.get('thematique', '').replace(',', ' ').replace(';', ' '),
            user_preferences.get('niveau_lecture', ''),
            user_preferences.get('frequence_lecture', ''),
            user_preferences.get('moment_consomation', '').replace(',', ' ').replace(';', ' '),
            user_preferences.get('auteur_prefere', ''),
            user_preferences.get('description', ''),
            user_preferences.get('decouvertePrefrence', '')
        ]
        
        profile_text = ' '.join([self.clean_text(part) for part in profile_text_parts if part])
        tokens = simple_preprocess(profile_text, deacc=True)
        
        # Inférer le vecteur
        vector = self.model.infer_vector(tokens)
        return vector
    
    def get_recommendations(self, user_preferences, top_n=5):
        """
        Obtenir les recommandations pour un nouveau profil
        
        Args:
            user_preferences: Dict avec les réponses du formulaire
            top_n: Nombre de profils similaires à rechercher
        
        Returns:
            List de recommandations avec scores
        """
        # Générer le vecteur pour le nouveau profil
        user_vector = self.infer_vector(user_preferences)
        
        # Calculer la similarité avec tous les profils du training
        similarities = {}
        for profile_id, profile_vector in self.profile_vectors.items():
            similarity = cosine_similarity(
                user_vector.reshape(1, -1),
                profile_vector.reshape(1, -1)
            )[0][0]
            similarities[profile_id] = similarity
        
        # Trier par similarité décroissante
        sorted_profiles = sorted(similarities.items(), key=lambda x: x[1], reverse=True)
        
        # Récupérer les recommandations des profils similaires
        all_recommendations = {}
        for profile_id, similarity_score in sorted_profiles[:top_n]:
            products = self.product_recommendations[profile_id]
            for product in products:
                if product in all_recommendations:
                    all_recommendations[product] += similarity_score
                else:
                    all_recommendations[product] = similarity_score
        
        # Trier les recommandations par score
        sorted_recommendations = sorted(
            all_recommendations.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        # Retourner les top recommandations
        results = [
            {
                'product': product,
                'score': score,
                'match_percentage': f"{int(score * 100)}%"
            }
            for product, score in sorted_recommendations[:10]
        ]
        
        return results
    
    def save_model(self, model_path="gensim_recommendation_model.pkl"):
        """Sauvegarder le modèle entraîné"""
        print(f"\n💾 Sauvegarde du modèle...")
        
        model_data = {
            'model': self.model,
            'profile_vectors': self.profile_vectors,
            'product_recommendations': self.product_recommendations
        }
        
        with open(model_path, 'wb') as f:
            pickle.dump(model_data, f)
        
        # Sauvegarder aussi le modèle Doc2Vec séparément
        doc2vec_path = model_path.replace('.pkl', '_doc2vec.model')
        self.model.save(doc2vec_path)
        
        print(f"   ✓ Modèle sauvegardé: {model_path}")
        print(f"   ✓ Doc2Vec sauvegardé: {doc2vec_path}")
    
    def load_model(self, model_path="gensim_recommendation_model.pkl"):
        """Charger un modèle pré-entraîné"""
        print(f"\n📦 Chargement du modèle...")
        
        with open(model_path, 'rb') as f:
            model_data = pickle.load(f)
        
        self.model = model_data['model']
        self.profile_vectors = model_data['profile_vectors']
        self.product_recommendations = model_data['product_recommendations']
        
        print(f"   ✓ Modèle chargé avec succès")
        print(f"   ✓ {len(self.profile_vectors)} profils disponibles")
    
    def get_model_stats(self):
        """Obtenir les statistiques du modèle"""
        if not self.model:
            return None
        
        return {
            'vocabulary_size': len(self.model.wv),
            'vector_size': self.model.vector_size,
            'num_profiles': len(self.profile_vectors),
            'num_products': len(set([p for recs in self.product_recommendations.values() for p in recs])),
            'epochs': self.model.epochs
        }


def train_and_save():
    """Pipeline complet: charger, entraîner, sauvegarder"""
    print("=" * 80)
    print("🚀 ENTRAÎNEMENT DU MODÈLE GENSIM")
    print("=" * 80)
    
    # Créer le moteur
    engine = GensimRecommendationEngine()
    
    # Charger les données
    engine.load_data()
    
    # Préparer les documents
    documents = engine.prepare_documents()
    
    # Entraîner le modèle
    engine.train_model(documents, vector_size=100, epochs=40)
    
    # Afficher les stats
    stats = engine.get_model_stats()
    print("\n📊 Statistiques du modèle:")
    for key, value in stats.items():
        print(f"   - {key}: {value}")
    
    # Sauvegarder
    engine.save_model()
    
    print("\n✨ Entraînement terminé avec succès!")
    return engine


def test_recommendations():
    """Tester le modèle avec un exemple"""
    print("\n" + "=" * 80)
    print("🧪 TEST DU MODÈLE")
    print("=" * 80)
    
    # Charger le modèle entraîné
    engine = GensimRecommendationEngine()
    engine.load_model()
    
    # Profil de test
    test_profile = {
        'tranche_age': '25-34',
        'objectif': 'apprendre;seDivertir',
        'format': 'livre;livreAudio',
        'thematique': 'science;fiction;tech',
        'niveau_lecture': 'intermediaire',
        'frequence_lecture': '30-60',
        'moment_consomation': 'soir;weekend',
        'auteur_prefere': 'Asimov',
        'description': 'Science-fiction épique avec des concepts avancés',
        'decouvertePrefrence': 'mix'
    }
    
    print("\n📝 Profil de test:")
    for key, value in test_profile.items():
        print(f"   {key}: {value}")
    
    # Obtenir les recommandations
    recommendations = engine.get_recommendations(test_profile, top_n=5)
    
    print("\n🎯 Recommandations:")
    for i, rec in enumerate(recommendations[:10], 1):
        print(f"   {i}. {rec['product']:40s} | Score: {rec['score']:.3f} | Match: {rec['match_percentage']}")
    
    return recommendations


if __name__ == "__main__":
    # 1. Entraîner et sauvegarder le modèle
    engine = train_and_save()
    
    # 2. Tester les recommandations
    test_recommendations()
    
    print("\n" + "=" * 80)
    print("✅ Pipeline complet terminé!")
    print("=" * 80)
