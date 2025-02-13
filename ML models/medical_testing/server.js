const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const FLASK_API_URL = 'http://127.0.0.1:5000';  // Flask server URL
const MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/"; // MongoDB URL
const DB_NAME = "AarogyaSaarthi";
const COLLECTION_NAME = "MedicalEquipments";

// Connect to MongoDB
async function getMongoCollection() {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    return client.db(DB_NAME).collection(COLLECTION_NAME);
}

// 🟢 Fetch Medical Equipment Data
app.get('/fetch-data', async (req, res) => {
    try {
        const collection = await getMongoCollection();
        const data = await collection.find({}, { projection: { Equipment_Type: 1, _id: 0 } }).toArray();

        if (data.length === 0) {
            return res.status(404).json({ error: "No medical equipment data found!" });
        }

        res.json(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: error.message });
    }
});

// 🟢 Train Model (Triggers Flask API)
app.get('/train-model', async (req, res) => {
    try {
        const response = await axios.get(`${FLASK_API_URL}/train`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🟢 Predict Equipment Availability (Only Equipment Type + Prediction)
app.get('/predict-equipment', async (req, res) => {
    try {
        const response = await axios.get(`${FLASK_API_URL}/predict`);

        // Extract only required fields
        const filteredData = response.data.map(item => ({
            Equipment_Type: item.Equipment_Type,
            Predicted_Availability: item.Predicted_Availability
        }));

        res.json(filteredData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Node.js server running on port ${PORT}`));
