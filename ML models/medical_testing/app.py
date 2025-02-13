from flask import Flask, jsonify
import joblib
import os
import random
import pandas as pd
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)

# Connect to MongoDB
MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/"
DB_NAME = "AarogyaSaarthi"
COLLECTION_NAME = "MedicalEquipments"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Directory where models are saved
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

# Function to fetch data from MongoDB
def fetch_data():
    data = list(collection.find({}, {"_id": 0}))
    df = pd.DataFrame(data)
    if df.empty:
        raise ValueError("No data found in MongoDB collection.")
    return df

# Function to generate minor variations
def generate_realistic_variation(base_value):
    variations = [-2, -1, 0, 1, 2]
    return [max(0, base_value + random.choice(variations)) for _ in range(3)]

# Endpoint to predict future stock for all medical equipment
@app.route('/predict_future_stock', methods=['POST'])
def predict_future_stock():
    try:
        df = fetch_data()
        stock_predictions = {}
        
        for equipment in df["Equipment_Type"].unique():
            model_filename = f"{equipment.replace(' ', '_').lower()}_model.joblib"
            model_path = os.path.join(MODEL_DIR, model_filename)
            
            if os.path.exists(model_path):
                model = joblib.load(model_path)
                base_prediction = max(0, int(model.predict([[1]])[0]))
                future_stock = generate_realistic_variation(base_prediction)
                stock_predictions[equipment] = future_stock
            else:
                stock_predictions[equipment] = "Model not found"
        
        return jsonify({"predicted_stock": stock_predictions})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
