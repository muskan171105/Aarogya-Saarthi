from flask import Flask, jsonify
from pymongo import MongoClient
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Connect to MongoDB Atlas
MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/"
client = MongoClient(MONGO_URI)

# Select Database and Collection
db = client["AarogyaSaarthi"]
collection = db["PriorityScheduling"]

# Define priority levels
admission_priority = {"Emergency": 3, "Urgent": 2, "Elective": 1}

def assign_priority(patient):
    priority = 0
    priority += admission_priority.get(patient.get("Admission Type", ""), 0) * 10
    if patient.get("Sepsis") == "Yes":
        priority += 15
    if patient.get("Heart Rate", 0) > 100 or patient.get("Heart Rate", 0) < 60:
        priority += 5
    if patient.get("Glucose", 0) > 140 or patient.get("Glucose", 0) < 70:
        priority += 5
    if patient.get("Potassium", 0) < 3.5 or patient.get("Potassium", 0) > 5.2:
        priority += 5
    if patient.get("Lactate", 0) > 2.0:
        priority += 5
    return priority

@app.route('/process', methods=['GET'])
def process_data():
    patients = list(collection.find({}, {"_id": 0}))  # Fetch data from MongoDB Atlas, exclude '_id' field

    for patient in patients:
        patient["Priority Score"] = assign_priority(patient)    

    sorted_patients = sorted(patients, key=lambda x: x["Priority Score"], reverse=True)

    return jsonify(sorted_patients[:100])  # Return top 100 high-priority patients

@app.route('/')
def home():
    return "AI Model Working!"

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 12000)) 
    app.run(host="0.0.0.0", port=port, debug=True)
