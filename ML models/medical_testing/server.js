const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/";
const DB_NAME = "AarogyaSaarthi";
const COLLECTION_NAME = "MedicalEquipments";

let client;
async function connectToMongo() {
    if (!client) {
        client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
    }
    return client.db(DB_NAME).collection(COLLECTION_NAME);
}

// Fetch all medical equipment stock from MongoDB
app.get("/get_all_stock", async (req, res) => {
    try {
        const collection = await connectToMongo();
        console.log("Fetching all medical equipment stock...");

        const allStock = await collection.find({}, { projection: { Equipment_Type: 1, Equipment_Availability: 1, _id: 0 } }).toArray();
        console.log("All Stock:", allStock);

        if (!allStock.length) return res.status(404).json({ error: "No medical equipment found" });

        res.json({ equipments: allStock });
    } catch (error) {
        console.error("Error in /get_all_stock:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Predict future stock for all medical equipment (3-month prediction)
app.get("/predict_future_stock", async (req, res) => {
    try {
        console.log("Fetching 3-month predictions from Flask...");

        const response = await axios.post("http://127.0.0.1:5000/predict_future_stock");

        console.log("Flask Response:", response.data); // Debugging log

        if (response.data.error) {
            return res.status(500).json({ error: "Error from ML model", details: response.data.error });
        }

        res.json({
            message: "3-month stock prediction successful",
            predicted_stock: response.data.predicted_stock
        });

    } catch (error) {
        console.error("Error in /predict_future_stock:", error);
        res.status(500).json({ error: "Error fetching prediction from Flask server", details: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
