import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import os

class RecommendationEngine:
    
    """
    Moteur de recommandations basé sur TF-IDF (Term Frequency-Inverse Document Frequency)
    
    Analyse les profils utilisateurs et génère des recommandations personnalisées
    en calculant la similarité cosinus entre le profil de l'utilisateur et les profils existants.
    """
    
    def __init__(self, training_data_path='user_profiles_training.csv'):
        """
        Initialize the recommendation engine
        
        Args:
            training_data_path: Path to CSV file with user training profiles
        """
        self.training_data_path = training_data_path
        self.vectorizer = TfidfVectorizer()
        self.tfidf_matrix = None
        self.user_profiles_df = None
        self.is_trained = False
        
    def load_training_data(self):
        """Load user profiles from CSV file"""
        try:
            if not os.path.exists(self.training_data_path):
                raise FileNotFoundError(f"Training data not found at {self.training_data_path}")
            
            self.user_profiles_df = pd.read_csv(self.training_data_path)
            print(f"✅ Loaded {len(self.user_profiles_df)} user profiles")
            return True
        except Exception as e:
            print(f"❌ Error loading training data: {e}")
            return False
    
    def create_profile_text(self, row):
        """
        Create a text representation of a user profile for TF-IDF analysis
        
        Combines all relevant user attributes into a single text string
        """
        text_parts = []
        
        # Add each profile attribute
        if pd.notna(row.get('tranche_age')):
            text_parts.append(str(row['tranche_age']))
        if pd.notna(row.get('objectif')):
            text_parts.append(str(row['objectif']))
        if pd.notna(row.get('format')):
            text_parts.append(str(row['format']))
        if pd.notna(row.get('thematique')):
            text_parts.append(str(row['thematique']))
        if pd.notna(row.get('niveau_lecture')):
            text_parts.append(str(row['niveau_lecture']))
        if pd.notna(row.get('frequence_lecture')):
            text_parts.append(str(row['frequence_lecture']))
        if pd.notna(row.get('moment_consomation')):
            text_parts.append(str(row['moment_consomation']))
        if pd.notna(row.get('auteur_prefere')):
            text_parts.append(str(row['auteur_prefere']))
        if pd.notna(row.get('description')):
            text_parts.append(str(row['description']))
        if pd.notna(row.get('decouvertePrefrence')):
            text_parts.append(str(row['decouvertePrefrence']))
        
        return ' '.join(text_parts)
    
    def train(self):
        """Train the TF-IDF model on user profiles"""
        try:
            if self.user_profiles_df is None:
                if not self.load_training_data():
                    return False
            
            # Create text representations of all user profiles
            profile_texts = self.user_profiles_df.apply(self.create_profile_text, axis=1)
            
            # Fit TF-IDF vectorizer and transform profiles
            self.tfidf_matrix = self.vectorizer.fit_transform(profile_texts)
            
            self.is_trained = True
            print(f"✅ Model trained on {len(profile_texts)} profiles")
            print(f"   Vocabulary size: {len(self.vectorizer.vocabulary_)}")
            return True
            
        except Exception as e:
            print(f"❌ Error training model: {e}")
            return False
    
    def get_recommendations(self, user_profile, top_n=3):
        """
        Get personalized recommendations for a user profile
        
        Args:
            user_profile: Dictionary with user profile attributes
            top_n: Number of recommendations to return (default: 3)
            
        Returns:
            List of recommendation strings
        """
        try:
            if not self.is_trained:
                print("⚠️ Model not trained, training now...")
                if not self.train():
                    return []
            
            # Create text representation of new user profile
            profile_text = self._dict_to_text(user_profile)
            
            # Transform new profile using trained vectorizer
            user_vector = self.vectorizer.transform([profile_text])
            
            # Calculate cosine similarity with all training profiles
            similarities = cosine_similarity(user_vector, self.tfidf_matrix).flatten()
            
            # Get indices of top N most similar profiles
            top_indices = similarities.argsort()[-top_n:][::-1]
            
            # Extract recommendations from similar profiles
            recommendations = []
            for idx in top_indices:
                similar_profile = self.user_profiles_df.iloc[idx]
                profile_recommendations = similar_profile.get('recommendations', '')
                
                if pd.notna(profile_recommendations) and profile_recommendations:
                    # Split recommendations (format: "Title - Author|Title - Author|...")
                    recs = str(profile_recommendations).split('|')
                    recommendations.extend(recs)
            
            # Remove duplicates while preserving order
            unique_recommendations = []
            seen = set()
            for rec in recommendations:
                rec = rec.strip()
                if rec and rec not in seen:
                    unique_recommendations.append(rec)
                    seen.add(rec)
                    if len(unique_recommendations) >= top_n:
                        break
            
            return unique_recommendations[:top_n]
            
        except Exception as e:
            print(f"❌ Error generating recommendations: {e}")
            return []
    
    def _dict_to_text(self, profile_dict):
        """Convert profile dictionary to text string"""
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
            "vocabulary_size": len(self.vectorizer.vocabulary_) if self.is_trained else 0
        }


# Singleton instance
_engine_instance = None

def get_engine():
    """Get or create singleton recommendation engine instance"""
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = RecommendationEngine()
    return _engine_instance
