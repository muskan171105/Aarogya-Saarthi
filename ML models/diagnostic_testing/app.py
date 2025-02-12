from flask import Flask, jsonify
import joblib
import os
import random
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")
db = client["AarogyaSaarthi"]
collection = db["DiagnosticEquipments"]

# Directory where models are saved
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

# Function to generate minor variations
def generate_realistic_variation(base_value):
    variations = [-2, -1, 0, 1, 2]  # Small variations only
    return [max(0, base_value + random.choice(variations)) for _ in range(3)]  # Keeps stock >= 0

# Endpoint to predict future stock for ALL equipment
@app.route('/predict_future_stock', methods=['POST'])
def predict_future_stock():
    try:
        # Fetch all equipment names from MongoDB
        all_stock_data = collection.find({}, {"diagnostic_equipments": 1, "_id": 0})

        stock_predictions = {}

        for item in all_stock_data:
            equipment_name = item["diagnostic_equipments"]

            # Convert equipment name to match saved model filenames
            model_filename = f"{equipment_name.replace(' ', '_').lower()}_model.joblib"
            model_path = os.path.join(MODEL_DIR, model_filename)

            # Check if model exists
            if os.path.exists(model_path):
                model = joblib.load(model_path)
                base_prediction = max(0, int(model.predict([[1]])[0]))

                # Generate 3 future predictions with minor variations
                future_stock = generate_realistic_variation(base_prediction)

                stock_predictions[equipment_name] = future_stock
            else:
                stock_predictions[equipment_name] = "Model not found"

        return jsonify({"predicted_stock": stock_predictions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
