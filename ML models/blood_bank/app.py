from flask import Flask, jsonify
from pymongo import MongoClient
from datetime import datetime, timedelta

app = Flask(__name__)

MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/"
client = MongoClient(MONGO_URI)
db = client["AarogyaSaarthi"]
collection = db["BloodBank"]

@app.route("/blood-requirement", methods=["GET"])
def get_blood_requirement():
    data = list(collection.find({}, {"_id": 0}))
    
    if not data:
        return jsonify({"error": "No data available"}), 404
    
    # Get the next 15 days from today
    today = datetime.today()
    dates = [(today + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(15)]
    
    blood_demand = {}
    for entry in data:
        blood_type = entry.get("Types of blood", "Unknown")
        total_demand = sum(entry.get(date, 0) for date in dates if date in entry)
        blood_demand[blood_type] = blood_demand.get(blood_type, 0) + total_demand
    
    return jsonify(blood_demand)

if __name__ == "__main__":
    app.run(debug=True)
