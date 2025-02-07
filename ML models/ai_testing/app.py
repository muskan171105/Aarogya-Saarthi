from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["hospitalDB"]
collection = db["patients"]  # Assuming patient data is stored in a 'patients' collection

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
    patients = list(collection.find({}, {"_id": 0}))  # Fetch data from MongoDB, exclude '_id' field

    for patient in patients:
        patient["Priority Score"] = assign_priority(patient)

    sorted_patients = sorted(patients, key=lambda x: x["Priority Score"], reverse=True)

    return jsonify(sorted_patients[:100])  # Return top 100 high-priority patients

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
