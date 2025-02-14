const express = require('express');
const mongoose = require('mongoose');
const { PythonShell } = require('python-shell');

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/AarogyaSaarthi", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const ppeSchema = new mongoose.Schema({}, { strict: false });
const PPE = mongoose.model("PPE", ppeSchema);

// Fetch PPE Data from MongoDB
app.get('/fetch_ppe', async (req, res) => {
    try {
        const data = await PPE.find({}, { _id: 0, PPE_Kits_Available_in_october: 1, PPE_Kits_Available_in_November: 1, PPE_Kits_Available_in_December: 1, PPE_Kits_Available_in_January: 1 });
        if (!data.length) return res.status(404).json({ message: "No data found" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Predict Future PPE Based on Dataset
app.get('/predict_ppe', async (req, res) => {
    try {
        const latestData = await PPE.findOne({}, { _id: 0, no_of_staff: 1, Avg_Monthly_PPE_Consumption: 1, ECLW: 1 });

        if (!latestData) return res.status(404).json({ message: "No valid data found for prediction" });

        let options = {
            mode: 'text',
            pythonOptions: ['-u'],
            scriptPath: './',
            args: [latestData.no_of_staff, latestData.Avg_Monthly_PPE_Consumption, latestData.ECLW]
        };

        PythonShell.run('predict_ppe.py', options, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(JSON.parse(results[0]));
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3001, () => console.log("Server running on port 3001"));
