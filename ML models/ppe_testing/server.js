const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// Predict PPE Stock
app.post("/predict-ppe", async (req, res) => {
    try {
        const { features } = req.body;
        if (!features || !Array.isArray(features)) {
            return res.status(400).json({ error: "Invalid input. Expected an array of numbers." });
        }

        const response = await axios.post("http://localhost:5001/predict-ppe", { features });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message || "Server error" });
    }
});

// Retrain PPE Model
app.post("/retrain-ppe", async (req, res) => {
    try {
        const { X, y } = req.body;
        if (!X || !y || !Array.isArray(X) || !Array.isArray(y)) {
            return res.status(400).json({ error: "Invalid training data. Expected lists of features and targets." });
        }

        const response = await axios.post("http://localhost:5001/retrain-ppe", { X, y });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message || "Server error" });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});
