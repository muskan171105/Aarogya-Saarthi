const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.use(express.json());

// Route to call Flask API for stock prediction
app.post("/predict-stock", async (req, res) => {
    try {
        const { equipment } = req.body;
        const response = await axios.post("http://127.0.0.1:5000/predict_stock", { equipment });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to call Flask API for future stock prediction
app.post("/predict-future-stock", async (req, res) => {
    try {
        const { time_step } = req.body;
        const response = await axios.post("http://127.0.0.1:5000/predict_future_stock", { time_step });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the Node server
app.listen(port, () => {
    console.log(`Node.js server is running on http://localhost:${port}`);
});
