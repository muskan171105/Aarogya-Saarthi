const express = require("express");
const axios = require("axios");
const { MongoClient } = require("mongodb");

const FLASK_API_URL = "http://127.0.0.1:5000"; // Flask server URL
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

// Fetch PPE Availability with Averages
app.get("/fetch-ppe", async (req, res) => {
    try {
        const ppeData = await fetchPPEData();
        if (!ppeData || ppeData.length === 0) {
            return res.status(404).json({ error: "No PPE data available." });
        }

        // Compute averages
        let totalEntries = ppeData.length;
        let sumOctober = 0, sumNovember = 0, sumDecember = 0;

        ppeData.forEach(({ PPE_Kits_Available_in_october, PPE_Kits_Available_in_November, PPE_Kits_Available_in_December }) => {
            sumOctober += PPE_Kits_Available_in_october || 0;
            sumNovember += PPE_Kits_Available_in_November || 0;
            sumDecember += PPE_Kits_Available_in_December || 0;
        });

        // Send the response in the exact format required
        res.json({
            PPE_Kits_Available_in_october: Math.round(sumOctober / totalEntries),
            PPE_Kits_Available_in_November: Math.round(sumNovember / totalEntries),
            PPE_Kits_Available_in_December: Math.round(sumDecember / totalEntries)
        });
    } catch (error) {
        console.error("Error fetching PPE data:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

// 🔹 Convert `/predict-ppe` to GET request
app.get("/predict-ppe", async (req, res) => {
    try {
        const ppeData = await fetchPPEData();
        if (!ppeData || ppeData.length === 0) {
            return res.status(404).json({ error: "No data found in database." });
        }

        // Extract features
        const features = ppeData.map(({ no_of_staff, Avg_Monthly_PPE_Consumption, ECLW }) => 
            [no_of_staff, Avg_Monthly_PPE_Consumption, ECLW]
        );

        // 🔹 Send GET request to Flask with query params
        const response = await axios.get(`${FLASK_API_URL}/predict-ppe`, { params: { features: JSON.stringify(features) } });

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
