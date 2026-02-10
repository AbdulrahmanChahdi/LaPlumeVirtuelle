"""
TF-IDF Recommendation Engine for La Plume Virtuelle

Uses scikit-learn's TF-IDF vectorizer to find similar user profiles
and recommend products based on user preferences.

This is a simpler, more reliable alternative to Gensim Doc2Vec
that works across Python versions.
"""

import pandas as pd
import pickle
import os
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


class TfidfRecommendationEngine:
    def __init__(self, model_path='tfidf_recommendation_model.pkl', vector_path='tfidf_vectors.pkl'):
        self.model_path = model_path
        self.vector_path = vector_path
        self.vectorizer = None
        self.user_profiles = None
        self.document_vectors = None
        self.recommendations_map = None
        
    def load_data(self, csv_path='user_profiles_training.csv'):
        """Load training data from CSV"""
        try:
            self.user_profiles = pd.read_csv(csv_path)
            print(f"✓ Loaded {len(self.user_profiles)} user profiles from {csv_path}")
            return True
        except Exception as e:
            print(f"✗ Error loading CSV: {e}")
            return False
    
    def prepare_documents(self):
        """Convert user profiles into text documents for TF-IDF"""
        documents = []
        for idx, row in self.user_profiles.iterrows():
            # Combine all preference fields into a single document
            doc_parts = [
                str(row['tranche_age']),
                str(row['objectif']),
                str(row['format']),
                str(row['thematique']),
                str(row['niveau_lecture']),
                str(row['frequence_lecture']),
                str(row['moment_consomation']),
                str(row['auteur_prefere']) if pd.notna(row['auteur_prefere']) else '',
                str(row['description']) if pd.notna(row['description']) else '',
                str(row['decouvertePrefrence']),
            ]
            doc = ' '.join([p for p in doc_parts if p.strip()])
            documents.append(doc)
        
        return documents
    
    def train_model(self, max_features=500, ngram_range=(1, 2)):
        """Train TF-IDF model on user profiles"""
        print("\n📚 Training TF-IDF model...")
        
        documents = self.prepare_documents()
        
        # Create and fit TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(
            max_features=max_features,
            ngram_range=ngram_range,
            lowercase=True,
            stop_words='english',
            min_df=1,
            max_df=0.8
        )
        
        self.document_vectors = self.vectorizer.fit_transform(documents)
        
        # Create recommendations mapping
        self.recommendations_map = {}
        for idx, row in self.user_profiles.iterrows():
            self.recommendations_map[idx] = {
                'recommendations': str(row['recommendations']).split('|'),
                'num_recommendations': int(row['num_recommendations'])
            }
        
        print(f"✓ TF-IDF model trained successfully")
        print(f"  - Vocabulary size: {len(self.vectorizer.get_feature_names_out())} terms")
        print(f"  - Training documents: {len(documents)}")
        
    def infer_vector(self, profile_dict):
        """Generate TF-IDF vector for new user profile"""
        doc_parts = [
            str(profile_dict.get('tranche_age', '')),
            str(profile_dict.get('objectif', '')),
            str(profile_dict.get('format', '')),
            str(profile_dict.get('thematique', '')),
            str(profile_dict.get('niveau_lecture', '')),
            str(profile_dict.get('frequence_lecture', '')),
            str(profile_dict.get('moment_consomation', '')),
            str(profile_dict.get('auteur_prefere', '')),
            str(profile_dict.get('description', '')),
            str(profile_dict.get('decouvertePrefrence', '')),
        ]
        doc = ' '.join([p for p in doc_parts if p.strip()])
        
        # Transform using existing vectorizer
        vector = self.vectorizer.transform([doc])
        return vector
    
    def get_recommendations(self, profile_dict, k=5):
        """
        Get product recommendations based on user profile
        
        Args:
            profile_dict: User preference dictionary
            k: Number of similar users to consider (default: 5)
        
        Returns:
            List of recommended products with scores
        """
        if self.vectorizer is None:
            raise ValueError("Model not trained. Call train_model() first.")
        
        # Get vector for new profile
        new_vector = self.infer_vector(profile_dict)
        
        # Calculate similarity with all training profiles
        similarities = cosine_similarity(new_vector, self.document_vectors)[0]
        
        # Get top-k similar users
        top_indices = np.argsort(similarities)[-k:][::-1]
        
        # Aggregate recommendations from similar users
        recommendation_counts = {}
        for idx in top_indices:
            if similarities[idx] > 0:  # Only consider positive similarity
                user_recs = self.recommendations_map[idx]['recommendations']
                for rec in user_recs:
                    rec = rec.strip()
                    if rec:
                        recommendation_counts[rec] = recommendation_counts.get(rec, 0) + 1
        
        # Sort by frequency
        sorted_recs = sorted(
            recommendation_counts.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return [
            {
                'product': rec[0],
                'score': float(similarities[top_indices[0]]),  # Use highest similarity as score
                'frequency': rec[1]
            }
            for rec in sorted_recs[:k]
        ]
    
    def save_model(self):
        """Save trained model to disk"""
        try:
            with open(self.model_path, 'wb') as f:
                pickle.dump({
                    'vectorizer': self.vectorizer,
                    'recommendations_map': self.recommendations_map
                }, f)
            print(f"✓ Model saved to {self.model_path}")
            return True
        except Exception as e:
            print(f"✗ Error saving model: {e}")
            return False
    
    def load_model(self):
        """Load trained model from disk"""
        try:
            with open(self.model_path, 'rb') as f:
                data = pickle.load(f)
                self.vectorizer = data['vectorizer']
                self.recommendations_map = data['recommendations_map']
            print(f"✓ Model loaded from {self.model_path}")
            return True
        except Exception as e:
            print(f"✗ Error loading model: {e}")
            return False


def main():
    """Train and test the recommendation engine"""
    engine = TfidfRecommendationEngine()
    
    # Load data
    if not engine.load_data('user_profiles_training.csv'):
        return
    
    # Train model
    engine.train_model()
    
    # Save model
    engine.save_model()
    
    # Test with sample profile
    print("\n🧪 Testing recommendations...")
    test_profile = {
        'tranche_age': '25-34',
        'objectif': 'apprendre',
        'format': 'livre',
        'thematique': 'science',
        'niveau_lecture': 'avance',
        'frequence_lecture': '30-60',
        'moment_consomation': 'soir',
        'auteur_prefere': 'Isaac Asimov',
        'description': 'Science-fiction avec intelligence artificielle et futur dystopique',
        'decouvertePrefrence': 'mix'
    }
    
    recommendations = engine.get_recommendations(test_profile, k=5)
    print("\n📖 Recommendations for test profile:")
    for i, rec in enumerate(recommendations, 1):
        print(f"  {i}. {rec['product']} (score: {rec['score']:.2f})")


if __name__ == '__main__':
    main()
