from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger
import traceback
import os
import pickle
from tfidf_training import TfidfRecommendationEngine

app = Flask(__name__)
CORS(app)

# Swagger configuration
swagger_template = {
    "swagger": "2.0",
    "info": {
        "title": "TF-IDF Recommendation API",
        "description": "API for book, audiobook, and podcast recommendations using TF-IDF",
        "version": "1.0.0"
    },
    "basePath": "/",
    "schemes": ["http", "https"]
}

swagger = Swagger(app, template=swagger_template)

# Model loading
engine = None

def load_model():
    global engine
    try:
        engine = TfidfRecommendationEngine()
        if engine.load_model():
            return True
        return False
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

# Load model on startup
if not load_model():
    print(f"Warning: Could not load model")

@app.route('/health', methods=['GET'])
def health():
    """
    Health check endpoint.
    ---
    responses:
        200:
            description: Service health status
            schema:
                type: object
                properties:
                    status:
                        type: string
                    service:
                        type: string
                    model_loaded:
                        type: boolean
    """
    return jsonify({
        'status': 'ok',
        'service': 'TF-IDF Recommendation API',
        'model_loaded': engine is not None
    })

@app.route('/api/recommendations', methods=['POST'])
def get_recommendations():
    """
    Get recommendations for a user profile.
    ---
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
            properties:
              user_profile:
                type: object
                description: User profile data
              top_k:
                type: integer
                default: 5
    responses:
        200:
            description: Recommendations generated
            schema:
                type: object
                properties:
                    recommendations:
                        type: array
                    scores:
                        type: array
        400:
            description: Invalid input
        500:
            description: Server error
    """
    try:
        if engine is None:
            return jsonify({'error': 'Model not loaded'}), 500

        data = request.get_json()
        if not data or 'user_profile' not in data:
            return jsonify({'error': 'Missing user_profile'}), 400

        user_profile = data['user_profile']
        k = data.get('top_k', 5)

        recommendations = engine.get_recommendations(user_profile, k=k)
        
        # Extract products and scores
        products = [rec['product'] for rec in recommendations]
        scores = [rec['score'] for rec in recommendations]

        return jsonify({
            'recommendations': products,
            'scores': scores
        })

    except Exception as e:
        # Log error server-side, don't expose details to client
        import logging
        logging.exception("Error in get_recommendations")
        return jsonify({
            'error': 'Failed to generate recommendations',
            'error_id': 'REC_001'
        }), 500

@app.route('/api/recommendations/detailed', methods=['POST'])
def get_recommendations_detailed():
    """
    Get detailed recommendations with scores and explanations.
    ---
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
    responses:
        200:
            description: Detailed recommendations
        500:
            description: Server error
    """
    try:
        if engine is None:
            return jsonify({'error': 'Model not loaded'}), 500

        data = request.get_json()
        if not data or 'user_profile' not in data:
            return jsonify({'error': 'Missing user_profile'}), 400

        user_profile = data['user_profile']
        top_k = data.get('top_k', 5)

        recommendations, scores = engine.get_recommendations(user_profile, top_k)

        detailed_recs = [
            {'product': rec, 'score': float(score)}
            for rec, score in zip(recommendations, scores)
        ]

        return jsonify({'recommendations': detailed_recs})

    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """
    Get model statistics.
    ---
    responses:
        200:
            description: Model statistics
        500:
            description: Server error
    """
    try:
        if engine is None:
            return jsonify({'error': 'Model not loaded'}), 500

        stats = {
            'vocab_size': len(engine.vectorizer.vocabulary_),
            'n_documents': engine.document_vectors.shape[0],
            'model_type': 'TF-IDF'
        }

        return jsonify(stats)

    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/train', methods=['POST'])
def train_model():
    """
    Retrain the model with new data.
    ---
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
    responses:
        200:
            description: Model retrained
        500:
            description: Server error
    """
    try:
        data = request.get_json()
        if not data or 'documents' not in data:
            return jsonify({'error': 'Missing documents'}), 400

        documents = data['documents']
        if not isinstance(documents, list):
            return jsonify({'error': 'Documents must be a list'}), 400

        # Retrain engine
        global engine
        engine = TfidfRecommendationEngine()
        engine.train(documents)

        # Save model
        with open(model_path, 'wb') as f:
            pickle.dump(engine, f)

        return jsonify({'status': 'Model trained and saved'})

    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/test', methods=['POST'])
def test_endpoint():
    """
    Test endpoint for debugging.
    ---
    parameters:
        - name: body
          in: body
          schema:
            type: object
    responses:
        200:
            description: Test response
    """
    try:
        data = request.get_json() or {}
        return jsonify({
            'status': 'test_ok',
            'received': data,
            'model_loaded': engine is not None
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

@app.route('/api/similar-profiles', methods=['POST'])
def find_similar_profiles():
    """
    Find similar user profiles.
    ---
    parameters:
        - name: body
          in: body
          required: true
          schema:
            type: object
    responses:
        200:
            description: Similar profiles found
        500:
            description: Server error
    """
    try:
        if engine is None:
            return jsonify({'error': 'Model not loaded'}), 500

        data = request.get_json()
        if not data or 'user_profile' not in data:
            return jsonify({'error': 'Missing user_profile'}), 400

        user_profile = data['user_profile']
        top_k = data.get('top_k', 5)

        # Similar functionality to recommendations
        recommendations, scores = engine.get_recommendations(user_profile, top_k)

        return jsonify({
            'similar_profiles': recommendations,
            'similarity_scores': scores.tolist()
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'traceback': traceback.format_exc()
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
