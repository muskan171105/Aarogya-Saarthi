from flask import Flask, jsonify
from pymongo import MongoClient
import os

app = Flask(__name__)

# Replace with your MongoDB connection string
MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/"
DATABASE_NAME = "AarogyaSaarthi"
COLLECTION_NAME = "Ventilator"

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
collection = db[COLLECTION_NAME]

@app.route('/predict', methods=['GET'])
def predict():
    # Fetch the first record from MongoDB (modify if needed)
    doc = collection.find_one({}, {"_id": 0, "Oct": 1, "Nov": 1, "Dec": 1, "Jan": 1, "Feb": 1, "Mar": 1, "Apr": 1, "May": 1})

    if doc:
        response = {
            "input_data": {
                "Oct": doc["Oct"],
                "Nov": doc["Nov"],
                "Dec": doc["Dec"],
                "Jan": doc["Jan"],
                "Feb": doc["Feb"]
            },
            "predicted_data": {
                "Mar": doc["Mar"],
                "Apr": doc["Apr"],
                "May": doc["May"]
            }
        }
        return jsonify(response)
    else:
        return jsonify({"message": "No records found"}), 404

@app.route('/')
def home():
    return "Ventilator API Running!"

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 10000)) 
    app.run(host="0.0.0.0", port=port, debug=True)
