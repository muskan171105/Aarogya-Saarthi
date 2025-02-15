from flask import Flask, jsonify
import numpy as np
import pandas as pd
import joblib
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB Connection
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")
db = client["AarogyaSaarthi"]
collection = db["PPE"]

# Load the trained model
model = joblib.load("ppe_model.pkl")

@app.route('/fetch_ppe', methods=['GET'])
def fetch_ppe():
    """Fetch PPE data from MongoDB and return actual values as integers with October adjusted."""
    latest_data = collection.find_one({}, {"_id": 0, "PPE_Kits_Available_in_october": 1, 
                                           "PPE_Kits_Available_in_November": 1,
                                           "PPE_Kits_Available_in_December": 1, 
                                           "PPE_Kits_Available_in_January": 1})

    if not latest_data:
        return jsonify({"message": "No data found"}), 404

    # Adjust October value (-500)
    latest_data["PPE_Kits_Available_in_october"] = max(0, latest_data["PPE_Kits_Available_in_october"]/4.98)

    # Convert all values to integers
    response = {month: int(value) for month, value in latest_data.items()}

    return jsonify(response)


@app.route('/predict_ppe', methods=['GET'])
def predict_ppe():
    """Predict PPE kits for February, March, and April based on dataset values."""
    # Fetch the latest available record
    latest_data = collection.find_one({}, {"_id": 0, "no_of_staff": 1, "Avg_Monthly_PPE_Consumption": 1, "ECLW": 1})
    
    if not latest_data:
        return jsonify({"message": "No valid data found for prediction"}), 404

    # Prepare input for the model
    input_data = np.array([[latest_data["no_of_staff"], latest_data["Avg_Monthly_PPE_Consumption"], latest_data["ECLW"]]])
    
    # Predict PPE kits for Feb, Mar, Apr
    prediction = model.predict(input_data)[0]

    response = {
        "February": int(abs(prediction[0]))-500,
        "March": int(abs(prediction[1])),
        "April": int(abs(prediction[2]))
    }
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)
