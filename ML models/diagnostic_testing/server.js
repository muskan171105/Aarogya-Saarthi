const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/AarogyaSaarthi", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const EquipmentSchema = new mongoose.Schema({
    diagnostic_equipments: String,
    stock_available: Number,
});

const Equipment = mongoose.model("DiagnosticEquipments", EquipmentSchema);

// Function to clean equipment names in MongoDB (Run once)
async function cleanEquipmentNames() {
    try {
        const equipments = await Equipment.find();
        for (const item of equipments) {
            const trimmedName = item.diagnostic_equipments.trim();
            if (trimmedName !== item.diagnostic_equipments) {
                await Equipment.updateOne({ _id: item._id }, { $set: { diagnostic_equipments: trimmedName } });
            }
        }
        console.log("Equipment names cleaned successfully.");
    } catch (error) {
        console.error("Error cleaning equipment names:", error);
    }
}

// Run the cleaning function once to remove spaces
cleanEquipmentNames();

// Fetch stock from MongoDB
app.post("/get_stock", async (req, res) => {
    try {
        let { equipment } = req.body;
        if (!equipment) return res.status(400).json({ error: "Equipment name is required" });

        // Trim spaces and make search case-insensitive
        equipment = equipment.trim();
        const stockData = await Equipment.findOne({ diagnostic_equipments: { $regex: `^${equipment}$`, $options: "i" } });

        if (!stockData) return res.status(404).json({ error: "Equipment not found" });

        res.json({ equipment: stockData.diagnostic_equipments, stock_available: stockData.stock_available });
    } catch (error) {
        console.error("Error in /get_stock:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Predict future stock requirement (Fixed to 3 months)
app.post("/predict_future_stock", async (req, res) => {
    try {
        const time_step = 3; // Always predict for 3 months

        const response = await axios.post("http://127.0.0.1:5000/predict_future_stock", { time_step });
        res.json(response.data);
    } catch (error) {
        console.error("Error in /predict_future_stock:", error);
        res.status(500).json({ error: "Error fetching prediction from Flask server" });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
