import express from "express";
import axios from "axios";
import cors from "cors";
import "dotenv/config";
const app = express();

app.use(cors());

// Flask API Base URL
const FLASK_API_URL = "https://jhu-techlions-ppe.onrender.com";

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

app.get("/", (req, res) => {
    res.send("PPE, Render!");
  });

const PORT = process.env.PORT || 3002; // Use environment port or fallback to 3001
app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});
