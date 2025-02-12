from flask import Flask, jsonify
import joblib
import numpy as np
from pymongo import MongoClient

app = Flask(__name__)

# Load Model & Encoder
MODEL_PATH = "blood_demand_model.pkl"
ENCODER_PATH = "label_encoder.pkl"
model = joblib.load(MODEL_PATH)
le = joblib.load(ENCODER_PATH)

# MongoDB Connection (Replace with your actual MongoDB connection string)
MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["AarogyaSaarthi"]
collection = db["BloodBank"]

@app.route('/predict', methods=['GET'])
def predict():
    try:
        # Fetch ALL blood bank data from MongoDB
        all_data = list(collection.find({}, {"_id": 0}))

        if not all_data:
            return jsonify({"error": "No data found in the database"}), 404

        print("Fetched Data:", all_data)  # Debugging line

        predictions = {}

        for entry in all_data:
            blood_type_encoded = entry.get("Types of blood")

            # **Fix NaN Values**: Skip if 'Types of blood' is missing
            if blood_type_encoded is None or str(blood_type_encoded) == "nan":
                continue

            # Convert to integer (to remove decimals like 2.0 → 2)
            blood_type_encoded = int(blood_type_encoded)

            # Decode number back to actual blood type (O+, A+, etc.)
            try:
                blood_type = le.inverse_transform([blood_type_encoded])[0]  # Convert back to blood group
            except ValueError:
                continue  # Skip if value is invalid

            # Extract features
            october = entry.get("October", 0)
            november = entry.get("November", 0)
            december = entry.get("December", 0)
            january = entry.get("January", 0)
            february = entry.get("February", 0)

            # Prepare input for prediction
            input_features = np.array([[blood_type_encoded, october, november, december, january, february]])
            prediction = model.predict(input_features)[0][0]  # Extract scalar value

            # Store prediction with correct blood type name
            predictions[blood_type] = round(prediction, 2)

        return jsonify({"predictions": predictions})

    except Exception as e:
        print("Error:", str(e))  # Debugging line
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
