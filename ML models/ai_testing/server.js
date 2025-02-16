const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/patients", async (req, res) => {
    try {
        const response = await axios.get("https://jhu-techlions-ai-model.onrender.com/process");
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001; // Use environment port or fallback to 3001
app.listen(PORT, () => {
    console.log(`Node.js server running on port ${PORT}`);
});

