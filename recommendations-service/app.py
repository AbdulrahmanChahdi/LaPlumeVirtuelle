from flask import Flask, request, jsonify
from flask_cors import CORS
from recommendation_engine import get_engine

app = Flask(__name__)

# Initialize recommendation engine
engine = get_engine()

# Enable CORS for Java backend integration
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080", "http://localhost:4200", "http://localhost:5173"]
    }
})

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    model_info = engine.get_model_info()
    return jsonify({
        "status": "healthy",
        "service": "recommendations-service",
        "model_trained": model_info["is_trained"],
        "num_profiles": model_info["num_profiles"]
    }), 200

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """
    Get personalized recommendations based on user profile
    
    Expected JSON body:
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
    """
    try:
        user_profile = request.get_json()
        
        if not user_profile:
            return jsonify({"error": "No user profile provided"}), 400
        
        # Get number of recommendations (default: 3)
        num_recs = user_profile.get('num_recommendations', 3)
        
        # Get recommendations from TF-IDF engine
        recommendations = engine.get_recommendations(user_profile, top_n=num_recs)
        
        return jsonify({
            "user_id": user_profile.get("user_id", "unknown"),
            "recommendations": recommendations,
            "num_recommendations": len(recommendations)
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/train', methods=['POST'])
def train_model():
    """
    Train or retrain the TF-IDF recommendation model
    """
    try:
        success = engine.train()
        
        if success:
            model_info = engine.get_model_info()
            return jsonify({
                "status": "success",
                "message": "Model trained successfully",
                "num_profiles": model_info["num_profiles"],
                "vocabulary_size": model_info["vocabulary_size"]
            }), 200
        else:
            return jsonify({
                "status": "error",
                "message": "Model training failed"
            }), 500
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Train model on startup
    print("[*] Starting Recommendations Service...")
    print("[*] Training TF-IDF model...")
    engine.train()
    print("[+] Ready to serve recommendations!")
    
    # Run on port 5001 for development (temporary change to avoid port conflict)
    app.run(host='0.0.0.0', port=5001, debug=False)
