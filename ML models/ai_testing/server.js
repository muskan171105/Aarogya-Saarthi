const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

app.get("/patients", async (req, res) => {
    try {
        const response = await axios.get("http://127.0.0.1:12000/process");
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/", (req, res) => {
    res.send("AI, Render!");
  });

const PORT = process.env.PORT || 3007; // Use environment port or fallback to 3001
app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});

