import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import cors from "cors";
import { MongoClient } from "mongodb";

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/";
const DB_NAME = "AarogyaSaarthi";
const COLLECTION_NAME = "MedicalEquipments";

// Fetch current stock and predicted stock together
app.get("/get_stock_with_prediction", async (req, res) => {
    try {
        console.log("Fetching current and predicted stock...");

        // Fetch current stock & predictions from Flask API
        const response = await axios.post("http://127.0.0.1:5000/get_equipment_availability");
        const stockData = response.data;

        console.log("Fetched Data from Flask:", stockData);

        res.json({ equipments: stockData });

    } catch (error) {
        console.error("Error in /get_stock_with_prediction:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => console.log(`Node.js server running on port ${PORT}`));
