from flask import Flask, jsonify
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")
db = client["AarogyaSaarthi"]  # Replace with your database name
collection = db["BloodBank"]  # Replace with your collection name

# Mapping of blood type IDs to blood group names
blood_type_map = {
    1: "O+",
    2: "A+",
    3: "B+",
    4: "AB+",
    5: "O-",
    6: "A-",
    7: "B-",
    8: "AB-"
}

@app.route("/blood_data", methods=["GET"])
def get_blood_data():
    data = collection.find({"Types of blood": {"$in": list(blood_type_map.keys())}})
    
    result = []
    for doc in data:
        result.append({
            "Blood Type": blood_type_map[doc["Types of blood"]],
            "Output": doc["Output"]
        })
    
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
