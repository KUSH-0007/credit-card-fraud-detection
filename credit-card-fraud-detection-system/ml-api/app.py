from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# Global variables for model components
model = None
scaler = None
feature_columns = None

def load_model():
    """Load the trained fraud detection model and preprocessing components"""
    global model, scaler, feature_columns
    
    try:
        model = joblib.load('model/fraud_detection_model.pkl')
        scaler = joblib.load('model/scaler.pkl')
        feature_columns = joblib.load('model/feature_columns.pkl')
        print("Model loaded successfully!")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        print("Creating new model...")
        try:
            from create_fraud_model import create_fraud_detection_model
            model, scaler, feature_columns = create_fraud_detection_model()
            print("New model created successfully!")
            return True
        except Exception as create_error:
            print(f"Error creating model: {create_error}")
            return False

def extract_features(transaction_data):
    """Extract features from transaction data for fraud detection"""
    try:
        # Parse transaction date
        if 'transactionDate' in transaction_data:
            if isinstance(transaction_data['transactionDate'], str):
                transaction_date = datetime.fromisoformat(transaction_data['transactionDate'].replace('Z', '+00:00'))
            else:
                transaction_date = transaction_data['transactionDate']
        else:
            transaction_date = datetime.now()
        
        # Extract time-based features
        hour = transaction_date.hour
        day_of_week = transaction_date.weekday()
        is_weekend = 1 if day_of_week >= 5 else 0
        is_night = 1 if hour < 6 or hour > 22 else 0
        
        # Extract amount
        amount = float(transaction_data.get('amount', 0))
        
        # Generate synthetic features (in a real system, these would come from user history)
        merchant_category = hash(transaction_data.get('merchant', 'unknown')) % 10
        card_age_days = np.random.randint(30, 1000)  # Simulated card age
        transaction_frequency = np.random.randint(1, 15)  # Simulated daily transaction frequency
        avg_transaction_amount = amount * np.random.uniform(0.5, 2.0)  # Simulated average
        distance_from_home = np.random.exponential(5)  # Simulated distance from home
        
        # Create feature vector
        features = {
            'amount': amount,
            'hour': hour,
            'day_of_week': day_of_week,
            'merchant_category': merchant_category,
            'card_age_days': card_age_days,
            'transaction_frequency': transaction_frequency,
            'avg_transaction_amount': avg_transaction_amount,
            'distance_from_home': distance_from_home,
            'is_weekend': is_weekend,
            'is_night': is_night
        }
        
        return features
    except Exception as e:
        print(f"Error extracting features: {e}")
        return None

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict', methods=['POST'])
def predict_fraud():
    """Predict if a transaction is fraudulent"""
    try:
        if model is None or scaler is None or feature_columns is None:
            return jsonify({
                'error': 'Model not loaded',
                'fraud': False,
                'confidence': 0.0
            }), 500
        
        # Get transaction data
        transaction_data = request.get_json()
        
        if not transaction_data:
            return jsonify({
                'error': 'No transaction data provided',
                'fraud': False,
                'confidence': 0.0
            }), 400
        
        # Extract features
        features = extract_features(transaction_data)
        if features is None:
            return jsonify({
                'error': 'Could not extract features',
                'fraud': False,
                'confidence': 0.0
            }), 400
        
        # Create feature vector in the correct order
        feature_vector = np.array([features[col] for col in feature_columns]).reshape(1, -1)
        
        # Scale features
        feature_vector_scaled = scaler.transform(feature_vector)
        
        # Make prediction
        fraud_probability = model.predict_proba(feature_vector_scaled)[0][1]
        is_fraud = fraud_probability > 0.5
        
        # Calculate confidence
        confidence = max(fraud_probability, 1 - fraud_probability)
        
        return jsonify({
            'fraud': bool(is_fraud),
            'fraud_probability': float(fraud_probability),
            'confidence': float(confidence),
            'features_used': features,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        print(f"Error in prediction: {e}")
        return jsonify({
            'error': str(e),
            'fraud': False,
            'confidence': 0.0
        }), 500

@app.route('/model_info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    return jsonify({
        'model_type': type(model).__name__,
        'feature_columns': feature_columns,
        'n_features': len(feature_columns) if feature_columns else 0,
        'model_loaded': True
    })

if __name__ == '__main__':
    # Load model on startup
    if load_model():
        print("Starting fraud detection API...")
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("Failed to load model. Please ensure the model files exist.")
        exit(1)