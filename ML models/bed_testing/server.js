// Updated Node.js server to handle all requests and communicate with Flask API
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
const COLLECTION_NAME = "bed_predictions";

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

// Train Model using Flask API via Node.js
app.get('/train-model', async (req, res) => {
    try {
        const response = await axios.get(`${FLASK_API_URL}/train`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Predict bed requirements using Flask API via Node.js
app.post('/predict-beds', async (req, res) => {
    try {
        if (!req.body.features) {
            return res.status(400).json({ error: "Missing 'features' in request body" });
        }

        const response = await axios.post(`${FLASK_API_URL}/predict`, {
            features: req.body.features
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Node.js server running on port ${PORT}`));
