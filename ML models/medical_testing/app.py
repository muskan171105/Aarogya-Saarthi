from flask import Flask, jsonify
import joblib
import os
import pandas as pd
import numpy as np
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)

# MongoDB connection
MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/"
DB_NAME = "AarogyaSaarthi"
COLLECTION_NAME = "MedicalEquipments"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

# Directory where ML models are stored
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

# Function to fetch data from MongoDB
def fetch_data():
    data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB _id field
    df = pd.DataFrame(data)
    if df.empty:
        raise ValueError("No data found in MongoDB collection.")
    return df

# Endpoint to predict future stock for all medical equipment
@app.route('/predict_future_stock', methods=['POST'])
def predict_future_stock():
    try:
        df = fetch_data()  # Fetch dataset from MongoDB

        if "Stock_Availability" not in df.columns or "Equipment_Availability" not in df.columns:
            return jsonify({"error": "Missing required columns in dataset"}), 400
        
        stock_predictions = {}
        
        for equipment in df["Equipment_Type"].unique():
            model_filename = f"{equipment.replace(' ', '_').lower()}_model.joblib"
            model_path = os.path.join(MODEL_DIR, model_filename)

            if os.path.exists(model_path):
                model = joblib.load(model_path)
                
                # Define future time points (30, 60, 90 days)
                future_availability = np.array([[30], [60], [90]])  # Fixed input values
                
                # Predict future stock
                future_stock = model.predict(future_availability).tolist()
                
                stock_predictions[equipment] = [round(val) for val in future_stock]
            else:
                stock_predictions[equipment] = "Model not found"

        return jsonify({"predicted_stock": stock_predictions})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)