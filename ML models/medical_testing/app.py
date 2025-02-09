from flask import Flask, request, jsonify
import joblib
import numpy as np
from pymongo import MongoClient

app = Flask(__name__)

# Load trained model
model = joblib.load("medical_equipment_model.pkl")

# MongoDB Connection
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "hospitalDB"
COLLECTION_NAME = "medical_equipment"
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    equipment_type = data.get("Equipment_Type")

    if not equipment_type:
        return jsonify({"error": "Missing 'Equipment_Type' in request"}), 400

    # Fetch equipment details from MongoDB
    equipment = collection.find_one({"Equipment_Type": equipment_type})

    if not equipment:
        return jsonify({"error": "Equipment not found in database"}), 404

    # Prepare input for model
    input_data = np.array([[equipment["Equipment_Availability"]]])

    # Predict using the ML model
    prediction = model.predict(input_data)

    return jsonify({"prediction": str(prediction[0])})

@app.route('/retrain', methods=['POST'])
def retrain():
    try:
        # Fetch all data from MongoDB
        data = list(collection.find({}, {"_id": 1, "Equipment_Availability": 1}))
        
        if not data:
            return jsonify({"error": "No data available for retraining"}), 400

        # Prepare dataset
        X = np.array([[d["Equipment_Availability"], d["_id"]] for d in data])
        Y = np.random.randint(0, 2, size=(len(data),))  # Dummy labels for training
        
        # Retrain model
        model.fit(X, Y)
        
        # Save retrained model
        joblib.dump(model, "medical_equipment_model.pkl")

        return jsonify({"message": "Model retrained successfully!"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
