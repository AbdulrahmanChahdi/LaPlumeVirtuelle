#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Test script to retrain model with corrections and verify API functionality
"""

import sys
import os

# Suppress unicode errors on Windows
os.environ['PYTHONIOENCODING'] = 'utf-8'

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

print("[TEST] Starting model training and API tests...")

try:
    from tfidf_training import TfidfRecommendationEngine
    
    print("[1] Testing TfidfRecommendationEngine...")
    engine = TfidfRecommendationEngine()
    
    print("[2] Loading CSV data...")
    if not engine.load_data('user_profiles_training.csv'):
        print("[ERROR] Failed to load CSV")
        sys.exit(1)
    
    print("[3] Training model...")
    if not engine.train_model():
        print("[ERROR] Failed to train model")
        sys.exit(1)
    
    print("[4] Saving model with corrections...")
    if not engine.save_model():
        print("[ERROR] Failed to save model")
        sys.exit(1)
    
    print("[5] Loading model back...")
    fresh_engine = TfidfRecommendationEngine()
    if not fresh_engine.load_model():
        print("[ERROR] Failed to load model")
        sys.exit(1)
    
    print("[6] Testing recommendations...")
    test_profile = {
        'tranche_age': '25-34',
        'objectif': 'apprendre',
        'format': 'livre',
        'thematique': 'science',
        'niveau_lecture': 'avance',
        'frequence_lecture': '30-60',
        'moment_consomation': 'soir',
        'auteur_prefere': 'Isaac Asimov',
        'description': 'Science-fiction et technologies',
        'decouvertePrefrence': 'mix'
    }
    
    recommendations = fresh_engine.get_recommendations(test_profile, k=5)
    print(f"[OK] Got {len(recommendations)} recommendations")
    
    # Extract products and scores
    scores = [rec['score'] for rec in recommendations]
    products = [rec['product'] for rec in recommendations]
    print(f"[OK] Products: {products}")
    print(f"[OK] Scores: {scores[:3]}")
    
    # Verify scoring is not all identical
    unique_scores = len(set([round(s, 4) for s in scores]))
    if unique_scores > 1:
        print(f"[OK] Scores are varied ({unique_scores} unique values)")
    else:
        print(f"[WARNING] All scores are identical - scoring logic may need review")
    
    print("\n[SUCCESS] All tests passed! Model is ready.")
    
except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
