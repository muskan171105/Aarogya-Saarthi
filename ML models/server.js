const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (hospitalDB → aarogya saarthi)
mongoose.connect('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define Schema for `aarogya saarthi`
const dataSchema = new mongoose.Schema({
    October: Number,
    November: Number,
    December: Number,
    January: Number,
    February: Number,
    timestamp: { type: Date, default: Date.now }
});

const InputData = mongoose.model('aarogya_saarthi', dataSchema, 'aarogya saarthi'); // Collection name

// Fetch latest data from MongoDB
app.get('/fetch-latest-input', async (req, res) => {
    try {
        const latestInput = await InputData.findOne().sort({ timestamp: -1 });

        if (!latestInput) {
            return res.status(404).json({ error: 'No input data found' });
        }

        res.json({
            input_data: [
                latestInput.October,
                latestInput.November,
                latestInput.December,
                latestInput.January,
                latestInput.February
            ]
        });
    } catch (error) {
        console.error("Error fetching latest input data:", error);
        res.status(500).json({ error: 'Error fetching latest input data' });
    }
});

// Send latest data to Flask for bed prediction
app.post('/predict-beds', async (req, res) => {
    try {
        const latestInput = await InputData.findOne().sort({ timestamp: -1 });

        if (!latestInput) {
            return res.status(404).json({ error: 'No input data found' });
        }

        const formattedInput = {
            input_data: [
                latestInput.October,
                latestInput.November,
                latestInput.December,
                latestInput.January,
                latestInput.February
            ]
        };

        // Send data to Flask for prediction
        const response = await axios.post('http://127.0.0.1:5000/predict', formattedInput);

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching bed prediction:", error);
        res.status(500).json({ error: 'Error fetching bed prediction' });
    }
});

// ✅ New Route: Send latest data to Flask for ventilator prediction
app.get('/predict-ventilators', async (req, res) => {
    try {
        const latestInput = await InputData.findOne().sort({ timestamp: -1 });

        if (!latestInput) {
            return res.status(404).json({ error: 'No input data found' });
        }

        const formattedInput = {
            input_data: [
                latestInput.October,
                latestInput.November,
                latestInput.December,
                latestInput.January,
                latestInput.February
            ]
        };

        // Send data to Flask for ventilator prediction
        const response = await axios.get('http://127.0.0.1:5000/predict-ventilators', { params: formattedInput });

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching ventilator prediction:", error);
        res.status(500).json({ error: 'Error fetching ventilator prediction' });
    }
});

// Start Node.js server
app.listen(3000, () => {
    console.log('Node.js backend running on port 3000');
});
