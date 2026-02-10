"""
Moteur NLP de recommandation
Utilise TF-IDF et la similarité cosinus pour recommander du contenu
"""

import pandas as pd
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from training_data import get_all_training_data

class RecommendationEngine:
    def __init__(self):
        """Initialise le moteur avec les données d'entraînement"""
        self.training_data = get_all_training_data()
        self.df_content = pd.DataFrame(self.training_data)
        
        # Créer la colonne de texte combiné
        self.df_content['text_combined'] = self.df_content.apply(
            self._combine_text, axis=1
        )
        
        # Vectoriser avec TF-IDF
        self.vectorizer = TfidfVectorizer(
            max_features=150,
            min_df=1,
            max_df=0.9,
            ngram_range=(1, 2)
        )
        
        self.tfidf_matrix = self.vectorizer.fit_transform(
            self.df_content['text_combined']
        )
        
        print(f"✅ Moteur NLP initialisé avec {len(self.training_data)} contenus")
    
    def _combine_text(self, row):
        """Combine les champs textuels d'un contenu"""
        text_parts = [
            str(row.get('titre', '')),
            str(row.get('genre', '')),
            str(row.get('description', '')),
            ' '.join(row.get('thematiques', [])),
            ' '.join(row.get('mots_cles', []))
        ]
        return self._clean_text(' '.join(text_parts))
    
    def _clean_text(self, text):
        """Nettoie et normalise le texte"""
        text = str(text).lower()
        # Supprimer les accents
        text = re.sub(r'[àâä]', 'a', text)
        text = re.sub(r'[éèêë]', 'e', text)
        text = re.sub(r'[îï]', 'i', text)
        text = re.sub(r'[ôö]', 'o', text)
        text = re.sub(r'[ûü]', 'u', text)
        text = re.sub(r'[ç]', 'c', text)
        # Garder seulement lettres et chiffres (et espaces)
        text = re.sub(r'[^a-z0-9\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text
    
    def _map_preferences(self, preferences):
        """Transforme les préférences du formulaire en texte pour la recherche"""
        text_parts = []
        
        # Thématiques
        if 'thematique' in preferences:
            themes = preferences['thematique'].split(',') if isinstance(preferences['thematique'], str) else []
            text_parts.extend(themes)
        
        # Description libre
        if 'description' in preferences and preferences['description']:
            text_parts.append(preferences['description'])
        
        # Auteur préféré
        if 'auteur_prefere' in preferences and preferences['auteur_prefere']:
            text_parts.append(preferences['auteur_prefere'])
        
        # Objectifs
        if 'objectif' in preferences:
            objectifs = preferences['objectif'].split(',') if isinstance(preferences['objectif'], str) else []
            for obj in objectifs:
                if 'apprendre' in obj:
                    text_parts.append('éducatif science connaissance')
                elif 'seDivertir' in obj:
                    text_parts.append('divertissement aventure fiction')
        
        return ' '.join(text_parts)
    
    def recommend(self, preferences, count=5):
        """
        Génère des recommandations basées sur les préférences utilisateur
        
        Args:
            preferences: dict des préférences utilisateur
            count: nombre de recommandations à retourner
            
        Returns:
            list de recommandations avec scores
        """
        # Créer le profil utilisateur
        user_text = self._map_preferences(preferences)
        user_text_cleaned = self._clean_text(user_text)
        
        if not user_text_cleaned:
            return []
        
        # Vectoriser le profil utilisateur
        user_vector = self.vectorizer.transform([user_text_cleaned])
        
        # Calculer la similarité
        similarity_scores = cosine_similarity(user_vector, self.tfidf_matrix)[0]
        
        # Ajouter les scores au DataFrame
        df_filtered = self.df_content.copy()
        df_filtered['score'] = similarity_scores
        
        # Filtrer par format si spécifié
        if 'format' in preferences and preferences['format']:
            formats = preferences['format'].split(',') if isinstance(preferences['format'], str) else []
            type_mapping = {
                'livre': 'livre',
                'livreAudio': 'livreAudio',
                'podcast': 'podcast'
            }
            allowed_types = [type_mapping.get(f.strip(), f.strip()) for f in formats]
            df_filtered = df_filtered[df_filtered['type'].isin(allowed_types)]
        
        # Filtrer par niveau de lecture si spécifié
        if 'niveau_lecture' in preferences and preferences['niveau_lecture']:
            niveau = preferences['niveau_lecture']
            if 'niveau_lecture' in df_filtered.columns:
                df_filtered = df_filtered[df_filtered['niveau_lecture'] == niveau]
        
        # Bonus de score basé sur les thématiques
        if 'thematique' in preferences:
            themes = set(preferences['thematique'].split(','))
            for idx, row in df_filtered.iterrows():
                row_themes = set(row.get('thematiques', []))
                overlap = len(themes.intersection(row_themes))
                if overlap > 0:
                    df_filtered.at[idx, 'score'] += 0.1 * overlap
        
        # Trier par score
        df_filtered = df_filtered.sort_values('score', ascending=False)
        
        # Retourner les top N
        recommendations = []
        for _, row in df_filtered.head(count).iterrows():
            rec = {
                'id': row['id'],
                'type': row['type'],
                'titre': row['titre'],
                'auteur': row.get('auteur', row.get('animateur', 'Inconnu')),
                'genre': row.get('genre', ''),
                'description': row.get('description', ''),
                'score': float(row['score'])
            }
            recommendations.append(rec)
        
        return recommendations

# Créer une instance globale du moteur
engine = RecommendationEngine()

def recommend(preferences, count=5):
    """Fonction wrapper pour les recommandations"""
    return engine.recommend(preferences, count)

if __name__ == "__main__":
    # Test du moteur
    print("="*80)
    print("🧪 TEST DU MOTEUR NLP")
    print("="*80)
    
    test_prefs = {
        "thematique": "science,fiction",
        "description": "intelligence artificielle futur dystopique",
        "format": "livre,livreAudio",
        "niveau_lecture": "avance"
    }
    
    recs = recommend(test_prefs, count=5)
    print(f"\n✅ {len(recs)} recommandations:")
    for i, rec in enumerate(recs, 1):
        print(f"\n{i}. {rec['titre']}")
        print(f"   Score: {rec['score']:.2%}")
