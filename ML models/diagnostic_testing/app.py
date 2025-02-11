from flask import Flask, request, jsonify
import joblib
import numpy as np
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")
db = client["AarogyaSaarthi"]
collection = db["DiagnosticEquipments"]

# Load trained models
rf_model = joblib.load("rf_model.joblib")
linear_model = joblib.load("linear_model.joblib")

# Function to clean equipment names in MongoDB (Run once)
def clean_equipment_names():
    for doc in collection.find():
        if "diagnostic_equipments" in doc:
            trimmed_name = doc["diagnostic_equipments"].strip()
            collection.update_one({"_id": doc["_id"]}, {"$set": {"diagnostic_equipments": trimmed_name}})

# Run the cleaning function once to remove spaces
clean_equipment_names()

# Endpoint to get stock availability from MongoDB
@app.route('/get_stock', methods=['GET'])
def get_stock():
    try:
        equipment_name = request.args.get("equipment")
        if not equipment_name:
            return jsonify({"error": "Equipment name is required"}), 400

        # Trim spaces and search case-insensitively in MongoDB
        stock_data = collection.find_one(
            {"diagnostic_equipments": {"$regex": f"^{equipment_name.strip()}$", "$options": "i"}}, 
            {"_id": 0, "stock_available": 1}
        )

        if stock_data:
            return jsonify({"stock_available": stock_data["stock_available"]})
        else:
            return jsonify({"error": "Equipment not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint for predicting future stock requirement using Linear Regression
@app.route('/predict_future_stock', methods=['POST'])
def predict_future_stock():
    try:
        data = request.get_json()
        future_time_step = data.get("time_step", 1)
        future_stock = linear_model.predict([[future_time_step]])
        return jsonify({"predicted_future_stock": int(future_stock[0])})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
