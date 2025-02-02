const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB (Database: aarogya saarthi)
mongoose.connect('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// ✅ Define Schema for bed_collection
const bedSchema = new mongoose.Schema({
    October: Number,
    November: Number,
    December: Number,
    January: Number,
    February: Number,
    timestamp: { type: Date, default: Date.now }
});
const BedData = mongoose.model('BedData', bedSchema, 'bed_collection'); // ✅ Collection: bed_collection

// ✅ Define Schema for ventilator_collection
const ventilatorSchema = new mongoose.Schema({
    Oct: Number,
    Nov: Number,
    Dec: Number,
    Jan: Number,
    Feb: Number,
    timestamp: { type: Date, default: Date.now }
});
const VentilatorData = mongoose.model('VentilatorData', ventilatorSchema, 'ventilator_collection'); // ✅ Collection: ventilator_collection

// ✅ Fetch latest bed data from MongoDB
app.get('/fetch-latest-beds', async (req, res) => {
    try {
        const latestBedData = await BedData.findOne().sort({ timestamp: -1 });

        if (!latestBedData) {
            return res.status(404).json({ error: 'No bed data found' });
        }

        res.json({
            input_data: [
                latestBedData.October,
                latestBedData.November,
                latestBedData.December,
                latestBedData.January,
                latestBedData.February
            ]
        });
    } catch (error) {
        console.error("Error fetching latest bed data:", error);
        res.status(500).json({ error: 'Error fetching latest bed data' });
    }
});

// ✅ Fetch latest ventilator data from MongoDB
app.get('/fetch-latest-ventilators', async (req, res) => {
    try {
        const latestVentilatorData = await VentilatorData.findOne().sort({ timestamp: -1 });

        if (!latestVentilatorData) {
            return res.status(404).json({ error: 'No ventilator data found' });
        }

        res.json({
            input_data: [
                latestVentilatorData.Oct,
                latestVentilatorData.Nov,
                latestVentilatorData.Dec,
                latestVentilatorData.Jan,
                latestVentilatorData.Feb
            ]
        });
    } catch (error) {
        console.error("Error fetching latest ventilator data:", error);
        res.status(500).json({ error: 'Error fetching latest ventilator data' });
    }
});

app.post('/predict-beds', async (req, res) => {
    try {
        const latestBedData = await BedData.findOne().sort({ timestamp: -1 });

        if (!latestBedData) {
            return res.status(404).json({ error: 'No bed data found' });
        }

        const formattedInput = {
            input_data: [
                latestBedData.October,
                latestBedData.November,
                latestBedData.December,
                latestBedData.January,
                latestBedData.February
            ]
        };

        console.log("📤 Sending bed data to Flask:", formattedInput); // Debugging log

        const response = await axios.post(
            'http://127.0.0.1:5000/predict', 
            formattedInput, 
            { headers: { 'Content-Type': 'application/json' } }
        );

        res.json(response.data);
    } catch (error) {
        console.error("🚨 Error fetching bed prediction:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching bed prediction' });
    }
});

app.post('/predict-ventilators', async (req, res) => {
    try {
        const latestVentilatorData = await VentilatorData.findOne().sort({ timestamp: -1 });

        if (!latestVentilatorData) {
            return res.status(404).json({ error: 'No ventilator data found' });
        }

        const formattedInput = {
            input_data: [
                latestVentilatorData.October,
                latestVentilatorData.November,
                latestVentilatorData.December,
                latestVentilatorData.January,
                latestVentilatorData.February
            ]
        };

        console.log("📤 Sending ventilator data to Flask:", formattedInput); // Debugging log

        const response = await axios.post(
            'http://127.0.0.1:5000/predict-ventilators', 
            formattedInput, 
            { headers: { 'Content-Type': 'application/json' } }
        );

        res.json(response.data);
    } catch (error) {
        console.error("🚨 Error fetching ventilator prediction:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching ventilator prediction' });
    }
});


// ✅ Start Node.js server
app.listen(3000, () => {
    console.log('Node.js backend running on port 3000');
});
