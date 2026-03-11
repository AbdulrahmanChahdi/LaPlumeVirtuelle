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
    },
    r"/nlp/*": {
        "origins": ["http://localhost:8080", "http://localhost:4200", "http://localhost:5173"]
    }
})


def _validate_nlp_payload(payload):
    if payload is None:
        return "JSON body is required", ["genres", "formats", "texteLibre"]

    required_fields = ["genres", "formats", "texteLibre"]
    missing_fields = [field for field in required_fields if field not in payload]
    if missing_fields:
        return "Missing required fields", missing_fields

    if not isinstance(payload.get("genres"), list):
        return "Field 'genres' must be a list", []

    if not isinstance(payload.get("formats"), list):
        return "Field 'formats' must be a list", []

    if not isinstance(payload.get("texteLibre"), str):
        return "Field 'texteLibre' must be a string", []

    non_string_genres = [g for g in payload["genres"] if not isinstance(g, str)]
    if non_string_genres:
        return "All items in 'genres' must be strings", []

    non_string_formats = [f for f in payload["formats"] if not isinstance(f, str)]
    if non_string_formats:
        return "All items in 'formats' must be strings", []

    return None, []

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


@app.route('/nlp/recommend', methods=['POST'])
def nlp_recommend():
    """
    Endpoint contract:
    Input JSON:
      {
        "genres": ["Roman", "Science"],
        "formats": ["livre", "podcast"],
        "texteLibre": "j'aime les histoires immersives",
        "limit": 12
      }
    Output JSON:
      {
        "recommendations": [
          {"id": "...", "type": "livre", "score": 0.81, ...}
        ],
        "total": 12
      }
    """
    try:
        payload = request.get_json(silent=True)
        error_message, missing_fields = _validate_nlp_payload(payload)
        if error_message is not None:
            response = {"error": error_message}
            if missing_fields:
                response["missingFields"] = missing_fields
            return jsonify(response), 400

        try:
            limit = int(payload.get("limit", 12))
        except (TypeError, ValueError):
            limit = 12
        limit = max(1, min(limit, 50))

        recommendations = engine.get_ranked_recommendations(
            genres=payload.get("genres", []),
            formats=payload.get("formats", []),
            texte_libre=payload.get("texteLibre", ""),
            top_n=limit,
        )

        return jsonify({
            "recommendations": recommendations,
            "total": len(recommendations)
        }), 200
    except Exception as e:
        return jsonify({
            "error": "Internal error while generating NLP recommendations",
            "details": str(e)
        }), 500

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
