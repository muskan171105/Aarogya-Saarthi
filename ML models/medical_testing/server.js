const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/";
const DB_NAME = "AarogyaSaarthi";
const COLLECTION_NAME = "MedicalEquipments";

// Fetch all medical equipment stock
app.get("/get_all_stock", async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        console.log("Fetching aggregated medical equipment stock...");

        // Aggregate stock by Equipment_Type
        const allStock = await collection.aggregate([
            {
                $group: {
                    _id: "$Equipment_Type",
                    Total_Stock: { $sum: "$Stock_Availability" }
                }
            },
            {
                $project: {
                    _id: 0,
                    Equipment_Type: "$_id",
                    Stock_Availability: "$Total_Stock"
                }
            }
        ]).toArray();

        console.log("Aggregated Stock:", allStock);

        await client.close();

        if (!allStock.length) return res.status(404).json({ error: "No equipment found" });

        res.json({ equipments: allStock });
    } catch (error) {
        console.error("Error in /get_all_stock:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Predict future stock for all medical equipment
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

        res.status(500).json({ error: "Error fetching prediction from Flask server", details: error.message });
    }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Node.js server running on port ${PORT}`));
