const express = require("express");
const axios = require("axios");

const app = express();
const port = 3001;

// Flask API URL
const FLASK_API_URL = "http://127.0.0.1:5000/blood_data";  // Change if Flask runs on a different port

app.get("/blood_data", async (req, res) => {
    try {
        const response = await axios.get(FLASK_API_URL);
        const data = response.data;

        res.json(data);  // Simply return the data received from Flask
    } catch (err) {
        console.error("Error fetching data from Flask:", err.message);
        res.status(500).send("Error fetching data");
    }
});

app.listen(port, () => {
    console.log(`✅ Node.js Server running at http://localhost:${port}/blood_data`);
});
