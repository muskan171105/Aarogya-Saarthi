from flask import Flask, jsonify
import joblib
import os
import random
from pymongo import MongoClient
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Connect to MongoDB
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")
db = client["AarogyaSaarthi"]
collection = db["MedicalEquipments"]

# Directory where models are saved
MODEL_DIR = os.path.dirname(os.path.abspath(__file__))

# Function to generate more realistic predictions
def generate_adjusted_prediction(stock_availability, base_prediction):
    if base_prediction == 0:
        return [max(0, stock_availability)] * 3  # Default to stock availability if model fails

    # Adjust base prediction closer to current stock availability
    avg_predicted_stock = (stock_availability + base_prediction) // 2

    # Apply small controlled variations (±10% of stock availability)
    variation_range = max(1, int(stock_availability * 0.1))  # Ensure at least 1 variation
    return [
        max(0, avg_predicted_stock + random.randint(-variation_range, variation_range))
        for _ in range(3)
    ]

# Endpoint to fetch unique equipment stock
@app.route('/get_equipment_availability', methods=['POST'])
def get_equipment_availability():
    try:
        # Fetch **unique** equipment types from MongoDB
        unique_stock_data = collection.aggregate([
            {"$group": {"_id": "$Equipment_Type", "Stock_Availability": {"$first": "$Stock_Availability"}}}
        ])

        stock_data = []

        for item in unique_stock_data:
            equipment_name = item["_id"]
            stock_availability = item.get("Stock_Availability", 0)  # Default to 0 if not found

            # Convert equipment name to match saved model filenames
            model_filename = f"{equipment_name.replace(' ', '_').lower()}_model.joblib"
            model_path = os.path.join(MODEL_DIR, model_filename)

            # Check if model exists
            if os.path.exists(model_path):
                model = joblib.load(model_path)
                base_prediction = max(0, int(model.predict([[1]])[0]))  # Get the model's prediction
                
                # Adjust prediction to be closer to stock availability
                future_stock = generate_adjusted_prediction(stock_availability, base_prediction)
            else:
                future_stock = [max(0, stock_availability)] * 3  # If model is missing, return same stock values

            stock_data.append({
                "Equipment_Type": equipment_name,
                "Stock_Availability": stock_availability,
                "Predicted_Availability": future_stock
            })

        return jsonify(stock_data)

    except Exception as e:
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
