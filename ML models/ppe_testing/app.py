from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score
import os

# Load the existing model
MODEL_PATH = "ppe_model.pkl"

if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = LinearRegression()  # Create a new model if no model exists

# Initialize Flask app
app = Flask(__name__)

@app.route("/predict-ppe", methods=["POST"])
def predict_ppe():
    try:
        data = request.get_json()
        input_features = data.get("features")  # Expecting an array like [250, 250, 110]

        if not input_features or not isinstance(input_features, list):
            return jsonify({"error": "Invalid input. Expected an array of numbers."}), 400

        input_array = np.asarray(input_features).reshape(1, -1)
        prediction = model.predict(input_array)

        response = {
            "PPE Kits Available in March": abs(int(prediction[0][0])),
            "PPE Kits Available in April": abs(int(prediction[0][1])),
            "PPE Kits Available in May": abs(int(prediction[0][2]))
        }
        
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/retrain-ppe", methods=["POST"])
def retrain_ppe():
    try:
        # Get new training data
        data = request.get_json()
        new_X = data.get("X")  # Expecting a list of feature lists
        new_y = data.get("y")  # Expecting a list of target lists

        if not new_X or not new_y or not isinstance(new_X, list) or not isinstance(new_y, list):
            return jsonify({"error": "Invalid training data. Expected lists of features and targets."}), 400

        # Convert data to numpy arrays
        new_X_array = np.asarray(new_X)
        new_y_array = np.asarray(new_y)

        # Retrain the model
        global model
        model.fit(new_X_array, new_y_array)

        # Save the updated model
        joblib.dump(model, MODEL_PATH)

        return jsonify({"message": "Model retrained and saved successfully!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
