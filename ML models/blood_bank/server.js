const express = require("express");
const axios = require("axios");
const cors = require("cors");  // Import CORS
require("dotenv").config();
const app = express();

// Flask API URL
const FLASK_API_URL = "http://127.0.0.1:16000/blood_data";  // Change if Flask runs on a different port

// Enable CORS for your frontend
app.use(cors());  

app.get("/blood_data", async (req, res) => {
    try {
        const response = await axios.get(FLASK_API_URL);
        res.json(response.data);  
    } catch (err) {
        console.error("Error fetching data from Flask:", err.message);
        res.status(500).send("Error fetching data");
    }
});

app.get("/", (req, res) => {
    res.send("Blood Bank, Render!");
  });

const PORT = process.env.PORT || 3005; // Use environment port or fallback to 3001
app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});