from flask import Flask, jsonify, request
import numpy as np
import pandas as pd
import joblib
from pymongo import MongoClient
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import os
from flask_cors import CORS
from celery import Celery

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configure Celery (for asynchronous task processing)
celery = Celery(app.name, broker="redis://localhost:6379/0")  # Assuming Redis is running locally

# Connect to MongoDB
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")  
db = client["AarogyaSaarthi"]
collection = db["Bed"]

# Fetch latest data from MongoDB
def fetch_data():
    data = list(collection.find({}, {"_id": 0}))  # Exclude MongoDB `_id` field
    return pd.DataFrame(data)

# Train the model
def train_model():
    dataset = fetch_data()
    
    if dataset.empty:
        raise ValueError("No data found in MongoDB collection")

    X = dataset[['October', 'November', 'December', 'January', 'February']]
    y = dataset[['March', 'April', 'May', 'Combined']]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = LinearRegression()
    model.fit(X_train, y_train)
    
    joblib.dump(model, 'hospital_bed_model.pkl')  # Save trained model
    return model

@app.route('/train', methods=['GET'])
def retrain():
    try:
        train_model()
        return jsonify({"message": "Model retrained with latest MongoDB data"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Load the trained model (load only when needed to save memory)
        model = joblib.load('hospital_bed_model.pkl')

        # Fetch latest data from MongoDB to get input values
        latest_data = fetch_data().iloc[-1]  # Get the most recent record
        input_features = latest_data[['October', 'November', 'December', 'January', 'February']].values.reshape(1, -1)

        # Make prediction
        prediction = model.predict(input_features)[0]

        # Format response
        response = {
            "March": int(prediction[0]),
            "April": int(prediction[1]),
            "May": int(prediction[2]),
            "Next_3_Months": int(prediction[3])
        }

        # Free memory after prediction
        del model
        torch.cuda.empty_cache()

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "Hello, Render!"

# Start Celery worker in background for asynchronous processing
@celery.task(name='tasks.retrain_model')
def retrain_model_task():
    train_model()

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000)) 
    app.run(host="0.0.0.0", port=port, debug=True)
