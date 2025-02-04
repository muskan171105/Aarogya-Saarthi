from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

# Initialize the Flask app
app = Flask(__name__)

# Load models and label encoder
rf_model = joblib.load("rf_model.joblib")
linear_model = joblib.load("linear_model.joblib")
le = joblib.load("label_encoder.joblib")

# Endpoint for predicting stock availability using Random Forest
@app.route('/predict_stock', methods=['POST'])
def predict_stock():
    try:
        # Get input data (assume JSON with 'equipment' and 'features')
        data = request.get_json()
        equipment_name = data.get("equipment")

        if not equipment_name:
            return jsonify({"error": "Equipment name is required"}), 400

        # Encode the equipment name
        equipment_encoded = le.transform([equipment_name])[0]

        # Prepare feature array (you will need to customize this based on your actual features)
        features = np.array([equipment_encoded]).reshape(1, -1)

        # Predict stock using the Random Forest model
        stock_prediction = rf_model.predict(features)
        
        # Return prediction result
        return jsonify({"predicted_stock": int(stock_prediction[0])})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint for predicting future stock requirement using Linear Regression
@app.route('/predict_future_stock', methods=['POST'])
def predict_future_stock():
    try:
        # Get input data (for future stock prediction)
        data = request.get_json()
        
        # Prepare data for future stock prediction (index for future step)
        future_time_step = data.get("time_step", len(le.classes_)+1)
        
        # Predict future stock using linear model
        future_stock = linear_model.predict([[future_time_step]])
        
        # Return predicted future stock
        return jsonify({"predicted_future_stock": int(future_stock[0])})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
