from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
import gc  # For memory management
from joblib import load

app = Flask(__name__)

# ✅ Connect to MongoDB
MONGO_URI = "mongodb://localhost:27017/"  # Change this to your actual MongoDB connection string
client = MongoClient(MONGO_URI)
db = client["hospitalDB"]  # Replace with your actual database name
bed_collection = db["bed_collection"]
ventilator_collection = db["ventilator_collection"]
ppe_collection = db["ppe_collection"]
diagnostic_collection = db["diagnostic_collection"]  # ✅ Added collection for diagnostic equipment

# ✅ Load the pre-trained models
bed_model = load('bed_prediction_model.pkl')
ventilator_model = load('ventilator_model.pkl')
ppe_model = load('ppe_model.pkl')
diagnostic_model = load('diagnostic_model.pkl')  # ✅ Load diagnostic equipment model

# ✅ Function to fetch data from MongoDB
def fetch_data_from_mongo(collection, feature_cols, target_cols):
    try:
        records = list(collection.find({}, {col: 1 for col in feature_cols + target_cols}))
        if not records:
            raise ValueError(f"No data found in {collection.name} collection.")

        df = pd.DataFrame(records)
        df.drop(columns=['_id'], inplace=True, errors='ignore')

        missing_cols = [col for col in feature_cols + target_cols if col not in df.columns]
        if missing_cols:
            raise ValueError(f"Missing columns in {collection.name}: {missing_cols}")

        return df[feature_cols], df[target_cols]
    except Exception as e:
        print(f"Error fetching data from {collection.name}: {e}")
        return None, None

# ✅ Fetch bed model training data
bed_features = ['October', 'November', 'December', 'January', 'February']
bed_targets = ['March', 'April', 'May', 'Combined']
X_bed, y_bed = fetch_data_from_mongo(bed_collection, bed_features, bed_targets)
if X_bed is None or y_bed is None:
    raise RuntimeError("Error loading bed dataset from MongoDB.")

# ✅ Fetch ventilator model training data
ventilator_features = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb']
ventilator_targets = ['Mar', 'Apr', 'May', 'Combined']
X_ventilator, y_ventilator = fetch_data_from_mongo(ventilator_collection, ventilator_features, ventilator_targets)
if X_ventilator is None or y_ventilator is None:
    raise RuntimeError("Error loading ventilator dataset from MongoDB.")

# ✅ Fetch PPE model training data
ppe_features = ['no_of_staff', 'Avg_Monthly_PPE_Consumption', 'ECLW']
ppe_targets = ['PPEKAIJ']
X_ppe, y_ppe = fetch_data_from_mongo(ppe_collection, ppe_features, ppe_targets)
if X_ppe is None or y_ppe is None:
    raise RuntimeError("Error loading PPE dataset from MongoDB.")

# ✅ Fetch diagnostic equipment model training data
diagnostic_features = ['patients_per_day', 'Avg_Testing_Rate', 'Equipment_Lifetime']
diagnostic_targets = ['Required_Equipment']  # Replace with actual target column name
X_diagnostic, y_diagnostic = fetch_data_from_mongo(diagnostic_collection, diagnostic_features, diagnostic_targets)
if X_diagnostic is None or y_diagnostic is None:
    raise RuntimeError("Error loading diagnostic dataset from MongoDB.")

# Free memory
gc.collect()

# ✅ Route for bed predictions
@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'input_data' not in data:
            return jsonify({"error": "Invalid JSON input"}), 400

        print("📥 Received bed data:", data)
        prediction = bed_model.predict([data["input_data"]])
        return jsonify({"predicted_beds": prediction.tolist()})
    
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# ✅ Route for ventilator predictions
@app.route('/predict-ventilators', methods=['POST'])
def predict_ventilators():
    try:
        data = request.get_json()
        if not data or 'input_data' not in data:
            return jsonify({"error": "Invalid JSON input"}), 400

        print("📥 Received ventilator data:", data)
        prediction = ventilator_model.predict([data["input_data"]])
        return jsonify({"predicted_ventilators": prediction.tolist()})

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# ✅ Route for PPE predictions
@app.route('/predict-ppe', methods=['POST'])
def predict_ppe():
    try:
        data = request.get_json()
        if not data or 'input_data' not in data:
            return jsonify({"error": "Invalid JSON input"}), 400

        print("📥 Received PPE data:", data)
        prediction = ppe_model.predict([data["input_data"]])
        return jsonify({"predicted_ppe": prediction.tolist()})

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

# ✅ Route for diagnostic equipment predictions
@app.route('/predict-diagnostic', methods=['POST'])
def predict_diagnostic():
    try:
        data = request.get_json()
        if not data or 'input_data' not in data:
            return jsonify({"error": "Invalid JSON input"}), 400

        print("📥 Received diagnostic data:", data)
        prediction = diagnostic_model.predict([data["input_data"]])
        return jsonify({"predicted_diagnostic_equipment": prediction.tolist()})

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
