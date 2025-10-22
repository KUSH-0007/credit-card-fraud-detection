import joblib
from sklearn.linear_model import LogisticRegression
import numpy as np
import os

# Create a dummy model
# This model is just a placeholder and has no predictive power.
X_dummy = np.array([[0, 0], [1, 1]])
y_dummy = np.array([0, 1])
dummy_model = LogisticRegression()
dummy_model.fit(X_dummy, y_dummy)

# Ensure the 'model' directory exists
if not os.path.exists('model'):
    os.makedirs('model')

# Save the dummy model to the expected path
file_path = 'model/fraud_detection_model.pkl'
joblib.dump(dummy_model, file_path)

print(f"Dummy model created and saved to '{file_path}'")