from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import joblib
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

# Connect to MongoDB
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")  # Update if using a remote database
db = client["AarogyaSaarthi"]
collection = db["Bed"]  # Change collection name if needed

# Fetch data from MongoDB
def fetch_data():
    data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB `_id` field
    return pd.DataFrame(data)

# Train the model
def train_model():
    dataset = fetch_data()
    X = dataset[['October', 'November', 'December', 'January', 'February']]
    y = dataset[['March', 'April', 'May', 'Combined']]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    joblib.dump(model, 'hospital_bed_model.pkl')  # Save trained model
    return model

# Initialize Flask app
app = Flask(__name__)

@app.route('/train', methods=['GET'])
def retrain():
    train_model()
    return jsonify({"message": "Model retrained with latest MongoDB data"})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Print received JSON data for debugging
        print("Received request data:", request.json)

        # Ensure 'features' key exists
        if 'features' not in request.json:
            return jsonify({"error": "Missing 'features' key in request body"}), 400

        # Load the trained model
        model = joblib.load('hospital_bed_model.pkl')

        # Get input data
        data = request.json['features']
        input_data = np.array(data).reshape(1, -1)

        # Make prediction
        prediction = model.predict(input_data)[0]

        # Format response
        response = {
            "March": int(prediction[0]) - 500,
            "April": int(prediction[1]) - 500,
            "May": int(prediction[2]) - 500,
            "Next_3_Months": int(prediction[3]) - 500
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    train_model()  # Train model on startup
    app.run(host='0.0.0.0', port=5000, debug=True)
