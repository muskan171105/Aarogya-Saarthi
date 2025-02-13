const express = require("express");
// const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require('cors');
const { MongoClient } = require("mongodb"); 

const app = express();
app.use(bodyParser.json());
app.use(cors());


const MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/";
const DB_NAME = "AarogyaSaarthi";
const COLLECTION_NAME = "DiagnosticEquipments";

// Fetch all equipment stock from MongoDB using MongoDB Client
app.get("/get_all_stock", async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        console.log("Sample");
        // Fetch data
        const allStock = await collection.find({}, { projection: { diagnostic_equipments: 1, stock_available: 1, _id: 0 } }).toArray();

        console.log("All Stock:", allStock);

        await client.close();

        if (!allStock.length) return res.status(404).json({ error: "No equipment found" });

        res.json({ equipments: allStock });
    } catch (error) {
        console.error("Error in /get_all_stock:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Predict future stock for all equipment
app.get("/predict_future_stock", async (req, res) => {
    try {
        console.log("Fetching predictions from Flask...");

        // Send request to Flask ML server
        const response = await axios.post("http://127.0.0.1:5000/predict_future_stock");

        console.log("Flask Response:", response.data); // Debugging log

        if (response.data.error) {
            return res.status(500).json({ error: "Error from ML model", details: response.data.error });
        }

        res.json(response.data);

    } catch (error) {
        console.error("Error in /predict_future_stock:", error);

        // Return the actual error details
        res.status(500).json({ error: "Error fetching prediction from Flask server", details: error.message });
    }
});



const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
