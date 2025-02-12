const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
const FLASK_URL = "http://127.0.0.1:5000"; // Flask server URL

app.use(bodyParser.json());

// Route to get predictions from Flask
app.post("/predict", async (req, res) => {
    try {
        const response = await axios.post(`${FLASK_URL}/predict`, req.body);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching prediction" });
    }
});

// Route to retrain the model
app.get("/retrain", async (req, res) => {
    try {
        const response = await axios.get(`${FLASK_URL}/retrain`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error retraining model" });
    }
});

app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});
