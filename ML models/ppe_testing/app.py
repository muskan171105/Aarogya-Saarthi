from flask import Flask, jsonify
import numpy as np
import joblib
import os
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB connection
MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/"
DB_NAME = "AarogyaSaarthi"
COLLECTION_NAME = "PPE"

# Load trained model
MODEL_PATH = "ppe_model.pkl"
model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None

# Function to fetch PPE data from MongoDB
def fetch_ppe_data():
    try:
        client = MongoClient(MONGO_URI, tls=True, tlsAllowInvalidCertificates=True)  # Fix SSL issue
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]

        # Fetch only required fields
        ppe_data = list(collection.find({}, {"no_of_staff": 1, "Avg_Monthly_PPE_Consumption": 1, "ECLW": 1, "_id": 0}))
        client.close()

        return ppe_data if ppe_data else None
    except Exception as e:
        print(f"Error fetching data: {e}")
        return None

@app.route("/predict-ppe", methods=["GET"])  # Change to GET since no input is needed
def predict_ppe():
    try:
        # Fetch data from MongoDB
        ppe_data = fetch_ppe_data()
        if not ppe_data:
            return jsonify({"error": "No data found in MongoDB"}), 500

        # Extract features (Handle missing fields)
        features = np.array([
            [d.get("no_of_staff", 0), d.get("Avg_Monthly_PPE_Consumption", 0), d.get("ECLW", 0)]
            for d in ppe_data
        ])

        if model is None:
            return jsonify({"error": "Model not found"}), 500

        # Predict PPE availability
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
    app.run(debug=True, port=5000)
