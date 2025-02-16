from flask import Flask, jsonify
import numpy as np
import pandas as pd
import joblib
from pymongo import MongoClient
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# MongoDB Connection
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")
db = client["AarogyaSaarthi"]
collection = db["PPE"]

# Load the trained model
model = joblib.load("ppe_model.pkl")

@app.route('/fetch_ppe', methods=['GET'])
def fetch_ppe():
    """Fetch PPE data from MongoDB and return averaged values."""
    cursor = collection.find({}, {"_id": 0, "PPE_Kits_Available_in_october": 1, 
                                  "PPE_Kits_Available_in_November": 1,
                                  "PPE_Kits_Available_in_December": 1, 
                                  "PPE_Kits_Available_in_January": 1})

    data_list = list(cursor)
    
    if not data_list:
        return jsonify({"message": "No data found"}), 404

    # Compute the average values for each column
    df = pd.DataFrame(data_list)
    avg_values = df.mean().to_dict()

    # Adjust October value (-500) and divide by 4.98
    avg_values["PPE_Kits_Available_in_october"] = max(0, avg_values.get("PPE_Kits_Available_in_october", 0) / 3.2)

    # Convert all values to integers
    response = {month: int(value) for month, value in avg_values.items()}

    return jsonify(response)


@app.route('/predict_ppe', methods=['GET'])
def predict_ppe():
    """Predict PPE kits for February, March, and April based on averaged dataset values."""
    cursor = collection.find({}, {"_id": 0, "no_of_staff": 1, "Avg_Monthly_PPE_Consumption": 1, "ECLW": 1})
    data_list = list(cursor)

    if not data_list:
        return jsonify({"message": "No valid data found for prediction"}), 404

    # Compute the average of the required fields
    df = pd.DataFrame(data_list)
    avg_values = df.mean().to_dict()

    # Prepare input for the model
    input_data = np.array([[avg_values.get("no_of_staff", 0), 
                            avg_values.get("Avg_Monthly_PPE_Consumption", 0), 
                            avg_values.get("ECLW", 0)]])

    # Predict PPE kits for Feb, Mar, Apr
    prediction = model.predict(input_data)[0]

    response = {
        "February": int(abs(prediction[0]))-200,
        "March": int(abs(prediction[1])),
        "April": int(abs(prediction[2]))
    }
    
    return jsonify(response)

@app.route('/')
def home():
    return "Hello, Render!"

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000)) 
    app.run(host="0.0.0.0", port=port, debug=True)
