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

const ppeSchema = new mongoose.Schema({
    no_of_staff: Number, // Number of staff
    Avg_Monthly_PPE_Consumption: Number, // Average monthly PPE consumption
    ECLW: Number, // Estimated Consumption Last Week (or whatever ECLW stands for)
    PPE_Kits_Available_in_october: Number, // PPE kits available in October
    PPE_Kits_Available_in_November: Number, // PPE kits available in November
    PPE_Kits_Available_in_December: Number, // PPE kits available in December
    PPEKAIJ: Number, // Target column (e.g., PPE Kits Available in January, February, March)
    timestamp: { type: Date, default: Date.now } // Timestamp for when the data was recorded
});
const PPEData = mongoose.model('PPEData', ppeSchema, 'ppe_collection'); // Collection: ppe_collection

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

// ✅ Fetch latest PPE data from MongoDB
app.get('/fetch-latest-ppe', async (req, res) => {
    try {
        const latestPPEData = await PPEData.findOne().sort({ timestamp: -1 });

        if (!latestPPEData) {
            return res.status(404).json({ error: 'No PPE data found' });
        }

        res.json({
            input_data: [
                latestPPEData.no_of_staff,
                latestPPEData.Avg_Monthly_PPE_Consumption,
                latestPPEData.ECLW
            ]
        });
    } catch (error) {
        console.error("Error fetching latest PPE data:", error);
        res.status(500).json({ error: 'Error fetching latest PPE data' });
    }
});

// ✅ Predict beds using Flask API
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

// ✅ Predict ventilators using Flask API
app.post('/predict-ventilators', async (req, res) => {
    try {
        const latestVentilatorData = await VentilatorData.findOne().sort({ timestamp: -1 });

        if (!latestVentilatorData) {
            return res.status(404).json({ error: 'No ventilator data found' });
        }

        const formattedInput = {
            input_data: [
                latestVentilatorData.Oct,
                latestVentilatorData.Nov,
                latestVentilatorData.Dec,
                latestVentilatorData.Jan,
                latestVentilatorData.Feb
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

// ✅ Predict PPE using Flask API
app.post('/predict-ppe', async (req, res) => {
    try {
        const latestPPEData = await PPEData.findOne().sort({ timestamp: -1 });

        if (!latestPPEData) {
            return res.status(404).json({ error: 'No PPE data found' });
        }

        const formattedInput = {
            input_data: [
                latestPPEData.no_of_staff,
                latestPPEData.Avg_Monthly_PPE_Consumption,
                latestPPEData.ECLW
            ]
        };

        console.log("📤 Sending PPE data to Flask:", formattedInput); // Debugging log

        const response = await axios.post(
            'http://127.0.0.1:5000/predict-ppe', 
            formattedInput, 
            { headers: { 'Content-Type': 'application/json' } }
        );

        res.json(response.data);
    } catch (error) {
        console.error("🚨 Error fetching PPE prediction:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Error fetching PPE prediction' });
    }
}); 

// ✅ Start Node.js server
app.listen(3000, () => {
    console.log('Node.js backend running on port 3000');
});