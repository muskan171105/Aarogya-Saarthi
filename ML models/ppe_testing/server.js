const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");

const FLASK_API_URL = "http://127.0.0.1:5001"; // Flask server URL
const MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/";
const DB_NAME = "AarogyaSaarthi";
const COLLECTION_NAME = "PPE";

const app = express();
app.use(express.json());

// Function to fetch PPE data from MongoDB
async function fetchPPEData() {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Fetch latest PPE data
        const ppeData = await collection.find().toArray();
        return ppeData;
    } catch (error) {
        console.error("Error fetching data from MongoDB:", error);
        return null;
    } finally {
        await client.close();
    }
}

// New Route: Fetch PPE Availability for Display
app.get("/fetch-ppe", async (req, res) => {
    try {
        const ppeData = await fetchPPEData();
        if (!ppeData || ppeData.length === 0) {
            return res.status(404).json({ error: "No PPE data available." });
        }
        res.json({ success: true, data: ppeData });
    } catch (error) {
        console.error("Error fetching PPE data:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// Predict PPE stock without client input
app.post("/predict-ppe", async (req, res) => {
    try {
        const ppeData = await fetchPPEData();
        if (!ppeData || ppeData.length === 0) {
            return res.status(404).json({ error: "No data found in database." });
        }

        // Extract features
        const features = ppeData.map(({ no_of_staff, Avg_Monthly_PPE_Consumption, ECLW }) => 
            [no_of_staff, Avg_Monthly_PPE_Consumption, ECLW]
        );

        // 🔹 Send POST request to Flask for prediction
        const response = await axios.post(`${FLASK_API_URL}/predict-ppe`, { features });

        res.json(response.data);
    } catch (error) {
        console.error("Error calling Flask API:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});
