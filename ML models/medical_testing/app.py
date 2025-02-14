import joblib
import pandas as pd
from pymongo import MongoClient
from flask import Flask, jsonify

app = Flask(__name__)

# MongoDB Connection
MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/"
DB_NAME = "AarogyaSaarthi"
COLLECTION_NAME = "MedicalEquipments"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

def fetch_data():
    """Fetches all medical equipment data from MongoDB."""
    data = list(collection.find({}, {"_id": 0}))  # Exclude `_id`
    df = pd.DataFrame(data)

    if df.empty:
        raise ValueError("No data found in MongoDB collection.")

    return df

def load_models():
    """Loads all trained models with feature names."""
    models = {}
    df = fetch_data()
    equipment_types = df["Equipment_Type"].unique()

    for equipment in equipment_types:
        model_filename = f"{equipment.replace(' ', '_').lower()}_model.joblib"
        try:
            model = joblib.load(model_filename)  # Load model only
            feature_names = None
            models[equipment] = (model, feature_names)
        except FileNotFoundError:
            print(f"Warning: Model file {model_filename} not found. Skipping {equipment}")

    return models

models = load_models()

@app.route("/predict_future_stock", methods=["POST"])  
def predict_future_stock():
    """Predicts future equipment availability for all equipment types."""
    try:
        df = fetch_data()
        predictions = {}

        for equipment, (model, _) in models.items():  # Ignore feature_names
            equipment_data = df[df["Equipment_Type"] == equipment].copy()

            if not equipment_data.empty:
                X_test = equipment_data[["Equipment_Availability"]]  # Use only Equipment_Availability

                predicted_values = model.predict(X_test)
                predictions[equipment] = predicted_values.tolist()

        return jsonify({"predictions": predictions})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
