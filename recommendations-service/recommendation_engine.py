import pandas as pd
import numpy as np
from numpy.linalg import norm
import re
import os
from gensim.models import Word2Vec
from gensim.utils import simple_preprocess

class RecommendationEngine:
    
    """
    Moteur de recommandations basé sur Word2Vec de Gensim
    Utilise le vrai algorithme Word2Vec (identique à ton exemple de code)
    """
    
    def __init__(self, training_data_path=None):
        """Initialise le moteur de recommandations"""
        if training_data_path is None:
            current_dir = os.path.dirname(os.path.abspath(__file__))
            training_data_path = os.path.join(current_dir, 'user_profiles_training.csv')
        
        self.training_data_path = training_data_path
        self.word2vec_model = None
        self.user_profiles_df = None
        self.profile_vectors = []
        self.qa_pairs = []  # Paires (profil, recommandations) - comme ton code
        self.is_trained = False
        self.vector_size = 100
        
    def load_training_data(self):
        """Load user profiles from CSV file"""
        try:
            if not os.path.exists(self.training_data_path):
                raise FileNotFoundError(f"Training data not found at {self.training_data_path}")
            
            self.user_profiles_df = pd.read_csv(self.training_data_path)
            print(f"[*] Loaded {len(self.user_profiles_df)} user profiles")
            return True
        except Exception as e:
            print(f"[!] Error loading training data: {e}")
            return False
    
    def create_profile_text(self, row):
        """Combine tous les attributs d'un profil en un texte"""
        text_parts = []
        for key in ['tranche_age', 'objectif', 'format', 'thematique', 
                    'niveau_lecture', 'frequence_lecture', 'moment_consomation',
                    'auteur_prefere', 'description', 'decouvertePrefrence']:
            if pd.notna(row.get(key)):
                text_parts.append(str(row[key]))
        return ' '.join(text_parts)
    
    def preprocess(self, text):
        """Tokenise le texte (gensim.utils.simple_preprocess)"""
        return simple_preprocess(text, min_len=2)
    
    def sentence_vector(self, sentence):
        """Convertit une phrase en vecteur (moyenne des vecteurs Word2Vec des mots)"""
        if not self.is_trained or self.word2vec_model is None:
            return np.zeros(self.vector_size)
        
        words = self.preprocess(sentence)
        vectors = []
        
        for word in words:
            if word in self.word2vec_model.wv:
                vectors.append(self.word2vec_model.wv[word])
        
        if not vectors:
            return np.zeros(self.vector_size)
        
        return np.mean(vectors, axis=0)
    
    def cosine_similarity(self, v1, v2):
        """Calcule la similarité cosinus entre deux vecteurs (comme ton code)"""
        if norm(v1) == 0 or norm(v2) == 0:
            return 0.0
        return np.dot(v1, v2) / (norm(v1) * norm(v2))
    
    def train(self):
        """Entraîne le modèle Word2Vec sur les profils utilisateurs (comme ton code)"""
        try:
            # === ÉTAPE 1: Charger les données CSV ===
            if self.user_profiles_df is None:
                if not self.load_training_data():
                    return False
            
            # === ÉTAPE 2: Créer les paires (profil → recommandations) comme tes qa_pairs ===
            sentences = []
            
            for _, row in self.user_profiles_df.iterrows():
                profile_text = self.create_profile_text(row)
                profile_tokens = self.preprocess(profile_text)
                sentences.append(profile_tokens)
                
                recommendations_text = ""
                if pd.notna(row.get('recommendations')):
                    recommendations_text = str(row['recommendations'])
                    rec_tokens = self.preprocess(recommendations_text)
                    sentences.append(rec_tokens)
                
                self.qa_pairs.append((profile_text, recommendations_text))
            
            # === ÉTAPE 3: ENTRAÎNER Word2Vec (comme ton code) ===
            self.word2vec_model = Word2Vec(
                sentences=sentences,
                vector_size=self.vector_size,
                window=5,
                min_count=1,
                workers=4,
                sg=1,
                seed=42
            )
            
            # === ÉTAPE 4: Marquer comme entraîné (AVANT de précalculer!) ===
            self.is_trained = True
            
            # === ÉTAPE 5: PRÉCALCULER LES VECTEURS ===
            self.profile_vectors = []
            for question, answer in self.qa_pairs:
                q_vector = self.sentence_vector(question)
                self.profile_vectors.append(q_vector)
            
            print(f"[+] Word2Vec model trained on {len(sentences)} sentences")
            print(f"    Vocabulary size: {len(self.word2vec_model.wv)}")
            print(f"    Profile vectors: {len(self.profile_vectors)}")
            return True
            
        except Exception as e:
            print(f"[!] Error training model: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def get_recommendations(self, user_profile, top_n=3):
        """Génère des recommandations équilibrées pour profils multi-thématiques"""
        try:
            if not self.is_trained:
                print("[!] Model not trained, training now...")
                if not self.train():
                    return []
            
            # === ÉTAPE 1: Convertir le nouveau profil en vecteur ===
            new_question = self._dict_to_text(user_profile)
            new_vector = self.sentence_vector(new_question)
            
            # === ÉTAPE 2: Détecter les thématiques multiples ===
            user_thematique = user_profile.get('thematique', '')
            # Mots-clés thématiques connus
            theme_keywords = ['science', 'policier', 'romance', 'thriller', 'fantasy', 'histoire', 
                            'technologie', 'philosophie', 'aventure', 'mystere', 'suspense']
            detected_themes = [kw for kw in theme_keywords if kw in user_thematique.lower()]
            
            print(f"\n[*] Thématiques détectées: {detected_themes if detected_themes else ['général']}")
            
            # === ÉTAPE 3: Calculer similarités avec tous les profils ===
            similarities = []
            
            print("\nSimilarites:")
            for idx, (question, answer) in enumerate(self.qa_pairs):
                q_vector = self.profile_vectors[idx]
                score = self.cosine_similarity(new_vector, q_vector)
                
                thematique = "N/A"
                if self.user_profiles_df is not None and idx < len(self.user_profiles_df):
                    thematique = self.user_profiles_df.iloc[idx].get('thematique', 'N/A')
                
                print(f"Similarite avec '{thematique}': {score:.3f}")
                similarities.append((score, answer, thematique, idx))
            
            # Trier par score décroissant
            similarities.sort(reverse=True, key=lambda x: x[0])
            
            # === ÉTAPE 4: Stratégie de fusion selon nombre de thématiques ===
            unique_recommendations = []
            seen = set()
            
            if len(detected_themes) >= 2:
                # MULTI-THÉMATIQUES: Équilibrer entre les thématiques
                print(f"\n[+] Mode multi-thématiques activé ({len(detected_themes)} thèmes)")
                
                # Pour chaque thématique, trouver les top profils
                profiles_per_theme = 2  # Top 2 profils par thématique
                selected_profiles = []
                
                for theme in detected_themes:
                    theme_matches = [s for s in similarities if theme in s[2].lower()]
                    selected_profiles.extend(theme_matches[:profiles_per_theme])
                    print(f"    - Top {profiles_per_theme} profils pour '{theme}':")
                    for score, _, thematique, _ in theme_matches[:profiles_per_theme]:
                        print(f"        {thematique} (score: {score:.3f})")
                
                # Fusionner les recommandations en alternant entre thématiques
                for score, answer, thematique, idx in selected_profiles:
                    if answer:
                        recs = str(answer).split('|')
                        for rec in recs:
                            rec = rec.strip()
                            if rec and rec not in seen:
                                unique_recommendations.append(rec)
                                seen.add(rec)
            else:
                # MONO-THÉMATIQUE: Stratégie classique top-K
                top_k = min(5, len(similarities))
                print(f"\n[+] Mode mono-thématique: fusion des {top_k} meilleurs profils")
                
                for score, answer, thematique, idx in similarities[:top_k]:
                    print(f"    - {thematique} (score: {score:.3f})")
                    if answer:
                        recs = str(answer).split('|')
                        for rec in recs:
                            rec = rec.strip()
                            if rec and rec not in seen:
                                unique_recommendations.append(rec)
                                seen.add(rec)
            
            # Retourner les top_n recommandations
            final_recommendations = unique_recommendations[:top_n]
            
            print(f"\n[+] Recommandations finales:")
            for rec in final_recommendations:
                print(f"    - {rec}")
            
            return final_recommendations
            
        except Exception as e:
            print(f"[!] Error generating recommendations: {e}")
            import traceback
            traceback.print_exc()
            return []
    
    def _dict_to_text(self, profile_dict):

        """Convertit un dictionnaire profil en texte (ex: {'age':'25-34'} → '25-34')"""
        text_parts = []
        for key in ['tranche_age', 'objectif', 'format', 'thematique', 
                    'niveau_lecture', 'frequence_lecture', 'moment_consomation',
                    'auteur_prefere', 'description', 'decouvertePrefrence']:
            value = profile_dict.get(key)
            if value:
                text_parts.append(str(value))
        return ' '.join(text_parts)
    
    def get_model_info(self):
        
        """Get information about the trained model"""
        return {
            "is_trained": self.is_trained,
            "num_profiles": len(self.user_profiles_df) if self.user_profiles_df is not None else 0,
            "vocabulary_size": len(self.word2vec_model.wv) if self.is_trained and self.word2vec_model else 0,
            "vector_size": self.vector_size
        }


# === SINGLETON PATTERN ===
_engine_instance = None

def get_engine():
    """Retourne l'instance unique du moteur de recommandations"""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = RecommendationEngine()
    return _engine_instance
