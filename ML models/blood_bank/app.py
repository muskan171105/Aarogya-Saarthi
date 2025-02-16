from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os

app = Flask(__name__)

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*"}})

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
                "October": {"$sum": {"$toDouble": "$October"}},  # Use "$toDouble" to keep decimals
                "November": {"$sum": {"$toDouble": "$November"}},
                "December": {"$sum": {"$toDouble": "$December"}},
                "January": {"$sum": {"$toDouble": "$January"}},
                "February": {"$sum": {"$toDouble": "$February"}},
                "15 Days Requirement": {"$sum": {"$toDouble": "$Output"}}
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
        blood_type = blood_type_map.get(doc["_id"])

        if blood_type:
            result.append({
                "Blood Type": blood_type,
                "15 Days Requirement": doc.get("15 Days Requirement", 0),  # No rounding
                "Data": {
                    "October": doc.get("October", 0),
                    "November": doc.get("November", 0),
                    "December": doc.get("December", 0),
                    "January": doc.get("January", 0),
                    "February": doc.get("February", 0)
                }
            })

    # 🔹 Sort in decreasing order based on "15 Days Requirement"
    result.sort(key=lambda x: x["15 Days Requirement"], reverse=True)

    return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000)) 
    app.run(host="0.0.0.0", port=port, debug=True)
