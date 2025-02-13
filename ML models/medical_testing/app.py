from flask import Flask, jsonify
import joblib
import pandas as pd
from pymongo import MongoClient
import os

app = Flask(__name__)

# MongoDB Connection
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")  
db = client["AarogyaSaarthi"]
collection = db["Bed"]

MODEL_PATH = "medical_equipment_model.pkl"

def fetch_data():
    """Fetches data from MongoDB and preprocesses it."""
    data = list(collection.find({}, {'_id': 0}))  # Exclude `_id` field
    df = pd.DataFrame(data)

    if df.empty:
        raise ValueError("No data found in MongoDB collection.")

    # Prepare features and target
    X = df.drop(columns=['Equipment_Availability'])  # Features
    Y = df['Equipment_Availability']  # Target variable
    
    return X, Y

def load_model():
    """Loads the saved model or trains a new one if not found."""
    if os.path.exists(MODEL_PATH):
        return joblib.load(MODEL_PATH)
    else:
        return None

@app.route('/train', methods=['GET'])
def train_model():
    """Train and save the model using MongoDB data."""
    try:
        X, Y = fetch_data()
        
        from sklearn.model_selection import train_test_split
        from sklearn.ensemble import RandomForestClassifier
        
        X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size=0.2, random_state=42)

        model = RandomForestClassifier()
        model.fit(X_train, Y_train)

        # Save model
        joblib.dump(model, MODEL_PATH)
        return jsonify({"message": "✅ Model trained and saved successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict', methods=['GET'])
def predict():
    """Fetch input from MongoDB and predict medical equipment availability."""
    try:
        model = load_model()
        if model is None:
            return jsonify({"error": "⚠️ Model not trained yet! Please train first."}), 400

        # Fetch data again (without target column) for prediction
        X, _ = fetch_data()  # Ignore target column
        predictions = model.predict(X)

        # Add predictions to response
        X['Predicted_Availability'] = predictions.tolist()
        
        return jsonify(X.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/fetch-data', methods=['GET'])
def fetch_equipment_data():
    """Fetch medical equipment data from MongoDB."""
    try:
        data = list(collection.find({}, {'_id': 0}))  # Exclude `_id` field
        if not data:
            return jsonify({"error": "No equipment data found!"}), 404
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
