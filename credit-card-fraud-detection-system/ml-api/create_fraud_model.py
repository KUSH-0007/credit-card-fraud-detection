import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os

def create_fraud_detection_model():
    """Create a fraud detection model with synthetic credit card transaction data"""
    
    # Set random seed for reproducibility
    np.random.seed(42)
    
    # Generate synthetic credit card transaction data
    n_samples = 10000
    
    # Generate features
    data = {
        'amount': np.random.exponential(50, n_samples),  # Transaction amounts (exponential distribution)
        'hour': np.random.randint(0, 24, n_samples),     # Hour of day
        'day_of_week': np.random.randint(0, 7, n_samples),  # Day of week
        'merchant_category': np.random.randint(0, 10, n_samples),  # Merchant category
        'card_age_days': np.random.randint(1, 3650, n_samples),  # Card age in days
        'transaction_frequency': np.random.poisson(5, n_samples),  # Transactions per day
        'avg_transaction_amount': np.random.exponential(30, n_samples),  # Average transaction amount
        'distance_from_home': np.random.exponential(10, n_samples),  # Distance from home
        'is_weekend': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),  # Weekend flag
        'is_night': np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),  # Night time flag
    }
    
    df = pd.DataFrame(data)
    
    # Create fraud labels based on patterns
    fraud_conditions = (
        (df['amount'] > 200) & (df['is_night'] == 1) |  # High amount at night
        (df['amount'] > 500) & (df['distance_from_home'] > 50) |  # High amount far from home
        (df['hour'] < 6) & (df['amount'] > 100) |  # Very early morning high amounts
        (df['transaction_frequency'] > 20) & (df['amount'] > 50) |  # High frequency + amount
        (df['merchant_category'] == 9) & (df['amount'] > 300)  # Specific merchant category
    )
    
    df['is_fraud'] = fraud_conditions.astype(int)
    
    # Add some noise to make it more realistic
    fraud_noise = np.random.choice([0, 1], n_samples, p=[0.95, 0.05])
    df['is_fraud'] = df['is_fraud'] | fraud_noise
    
    # Ensure we have both fraud and non-fraud cases
    fraud_count = df['is_fraud'].sum()
    if fraud_count < 100:
        # Add more fraud cases
        additional_fraud = np.random.choice(df[df['is_fraud'] == 0].index, 
                                          min(200, len(df[df['is_fraud'] == 0])), 
                                          replace=False)
        df.loc[additional_fraud, 'is_fraud'] = 1
    
    # Prepare features and target
    feature_columns = [col for col in df.columns if col != 'is_fraud']
    X = df[feature_columns]
    y = df['is_fraud']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train the model
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        class_weight='balanced'
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate the model
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"Training accuracy: {train_score:.4f}")
    print(f"Test accuracy: {test_score:.4f}")
    print(f"Fraud cases in dataset: {y.sum()}")
    print(f"Non-fraud cases in dataset: {(y == 0).sum()}")
    
    # Save the model and scaler
    os.makedirs('model', exist_ok=True)
    joblib.dump(model, 'model/fraud_detection_model.pkl')
    joblib.dump(scaler, 'model/scaler.pkl')
    joblib.dump(feature_columns, 'model/feature_columns.pkl')
    
    print("Model saved successfully!")
    return model, scaler, feature_columns

if __name__ == "__main__":
    create_fraud_detection_model()
