import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());

// Flask API Base URL
const FLASK_API_URL = "http://127.0.0.1:5000"; // Change if Flask runs on a different port

// Route to fetch PPE data from Flask API
app.get("/fetch_ppe", async (req, res) => {
    try {
        const response = await axios.get(`${FLASK_API_URL}/fetch_ppe`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching PPE data", details: error.message });
    }
});

// Route to fetch PPE prediction from Flask API
app.get("/predict_ppe", async (req, res) => {
    try {
        const response = await axios.get(`${FLASK_API_URL}/predict_ppe`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error fetching PPE prediction", details: error.message });
    }
});

// Start the Node server
app.listen(PORT, () => {
    console.log(`Node server is running on http://localhost:${PORT}`);
});
