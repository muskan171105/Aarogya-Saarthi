from flask import Flask, jsonify
from pymongo import MongoClient
import json

app = Flask(__name__)

# MongoDB Connection
client = MongoClient("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/")
db = client["AarogyaSaarthi"]
collection = db["BloodBank"]

# ✅ Blood Type Mapping (IDs to Names)
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
    pipeline = [
        {
            "$group": {
                "_id": "$Types of blood",
                "October": {"$sum": {"$toInt": "$October"}},
                "November": {"$sum": {"$toInt": "$November"}},
                "December": {"$sum": {"$toInt": "$December"}},
                "January": {"$sum": {"$toInt": "$January"}},
                "February": {"$sum": {"$toInt": "$February"}},
                "15 Days Requirement": {"$sum": {"$toInt": "$Output"}}
            }
        },
        {
            "$project": {
                "_id": 1,
                "October": {"$divide": ["$October", 5]},
                "November": {"$divide": ["$November", 5]},
                "December": {"$divide": ["$December", 5]},
                "January": {"$divide": ["$January", 5]},
                "February": {"$divide": ["$February", 5]},
                "15 Days Requirement": {"$divide": ["$15 Days Requirement", 5]}
            }
        }
    ]

    data = collection.aggregate(pipeline)
    raw_data = list(data)  

    result = []
    for doc in raw_data:
        blood_type = blood_type_map.get(doc["_id"])  # 🔍 Only add if blood type exists

        if blood_type:  # ✅ Exclude unknown blood types
            result.append({
                "Blood Type": blood_type,
                "15 Days Requirement": doc.get("15 Days Requirement", 0),
                "Data": {
                    "October": doc.get("October", 0),
                    "November": doc.get("November", 0),
                    "December": doc.get("December", 0),
                    "January": doc.get("January", 0),
                    "February": doc.get("February", 0)
                }
            })

    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
