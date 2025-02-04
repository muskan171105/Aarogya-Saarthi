const express = require("express");
const axios = require("axios");

const app = express();

app.get("/patients", async (req, res) => {
    try {
        const response = await axios.get("http://127.0.0.1:3000/process");
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Node.js server running on http://localhost:3000");
});
