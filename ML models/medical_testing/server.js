const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const FLASK_API_URL = 'http://127.0.0.1:5000';
const MONGO_URI = "mongodb://localhost:27017";
const DB_NAME = "hospitalDB";
const COLLECTION_NAME = "medical_equipment";

// Fetch data from MongoDB
app.get('/fetch-data', async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        const data = await collection.find({}).toArray();
        await client.close();
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Predict equipment availability based on Equipment Type
app.post('/predict-equipment', async (req, res) => {
    const { Equipment_Type } = req.body;

    if (!Equipment_Type) {
        return res.status(400).json({ error: "Missing 'Equipment_Type' in request body" });
    }

    try {
        // Connect to MongoDB
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Fetch equipment details from MongoDB
        const equipment = await collection.findOne({ Equipment_Type });

        if (!equipment) {
            await client.close();
            return res.status(404).json({ error: "Equipment not found in database" });
        }

        // Send data to Flask for prediction
        const response = await axios.post(`${FLASK_API_URL}/predict`, { Equipment_Type });

        await client.close();
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Retrain Model
app.post('/retrain-model', async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_API_URL}/retrain`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Node.js server running on port ${PORT}`));
