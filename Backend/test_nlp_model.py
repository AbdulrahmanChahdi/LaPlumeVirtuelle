"""
Script de test pour le modèle NLP
"""
from nlp_engine import recommend

# Test avec des préférences d'exemple
print("="*80)
print("🧪 TEST DU MODÈLE NLP")
print("="*80)

# Exemple 1 : Fan de Science-Fiction
print("\n📚 Test 1 : Utilisateur fan de Science-Fiction")
print("-" * 80)

preferences_sf = {
    "tranche_age": "25-34",
    "objectif": "apprendre,seDivertir",
    "format": "livre,livreAudio",
    "thematique": "fiction,science",
    "niveau_lecture": "avance",
    "frequence_lecture": "30-60",
    "moment_consomation": "soir",
    "auteur_prefere": "Asimov, Clarke",
    "description": "Science-fiction avec intelligence artificielle et futur dystopique",
    "decouvertePrefrence": "mix",
    "RGPD": True
}

try:
    recommendations = recommend(preferences_sf, count=5)
    if recommendations:
        print(f"✅ {len(recommendations)} recommandations trouvées :\n")
        for i, rec in enumerate(recommendations, 1):
            print(f"{i}. {rec['titre']}")
            print(f"   Type: {rec['type']} | Genre: {rec.get('genre', 'N/A')}")
            print(f"   Score: {rec['score']:.2%}")
            print()
    else:
        print("❌ Aucune recommandation trouvée")
except Exception as e:
    print(f"❌ Erreur : {e}")
    import traceback
    traceback.print_exc()

# Exemple 2 : Romance classique
print("\n📖 Test 2 : Utilisateur aimant la romance classique")
print("-" * 80)

preferences_romance = {
    "tranche_age": "35-44",
    "objectif": "seDivertir",
    "format": "audiobook",
    "thematique": "romance",
    "niveau_lecture": "intermediaire",
    "frequence_lecture": "15-30",
    "moment_consomation": "transport",
    "description": "Histoires d'amour classiques et émouvantes",
    "decouvertePrefrence": "habitudes",
    "RGPD": True
}

try:
    recommendations = recommend(preferences_romance, count=3)
    if recommendations:
        print(f"✅ {len(recommendations)} recommandations trouvées :\n")
        for i, rec in enumerate(recommendations, 1):
            print(f"{i}. {rec['titre']}")
            print(f"   Type: {rec['type']} | Genre: {rec.get('genre', 'N/A')}")
            print(f"   Score: {rec['score']:.2%}")
            print()
    else:
        print("❌ Aucune recommandation trouvée")
except Exception as e:
    print(f"❌ Erreur : {e}")

print("\n" + "="*80)
print("✅ Tests terminés !")
print("="*80)
