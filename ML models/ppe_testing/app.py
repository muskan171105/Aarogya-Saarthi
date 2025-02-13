from flask import Flask, request, jsonify
import numpy as np
import joblib
import os
app = Flask(__name__)

# Load trained model
MODEL_PATH = "ppe_model.pkl"
model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None

@app.route("/predict-ppe", methods=["POST"])  # Allow POST instead of GET
def predict_ppe():
    try:
        data = request.json  # Get JSON data from request
        features = np.array(data["features"])  # Convert to NumPy array

        if model is None:
            return jsonify({"error": "Model not found"}), 500

        predictions = model.predict(features)

        response = [
            {
                "PPE_Kits_Available_in_November": abs(int(pred[0])),
                "PPE_Kits_Available_in_December": abs(int(pred[1])) + 400,
                "PPE_Kits_Available_in_January": abs(int(pred[2])) + 400
            }
            for pred in predictions
        ]

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
