const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

const FLASK_API_URL = 'http://127.0.0.1:5000';
const MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/";
const DB_NAME = "AarogyaSaarthi";
const COLLECTION_NAME = "Bed";

// Fetch data from MongoDB
app.get('/fetch-data', async (req, res) => {
    try {
        const client = new MongoClient(MONGO_URI);
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Fetch all documents
        const data = await collection.find({}).toArray();

        // Months to consider
        const months = ["October", "November", "December", "January", "February"];
        let monthWiseData = {};

        // Initialize sum and count for each month
        months.forEach(month => {
            monthWiseData[month] = { sum: 0, count: 0 };
        });

        // Process each document
        data.forEach(doc => {
            months.forEach(month => {
                if (doc[month] !== undefined) {  // Ensure field exists
                    monthWiseData[month].sum += doc[month];
                    monthWiseData[month].count += 1;
                }
            });
        });

        // Compute average for each month
        let result = {};
        months.forEach(month => {
            if (monthWiseData[month].count > 0) {
                result[month] = Math.round(monthWiseData[month].sum / monthWiseData[month].count);
            }
        });

        await client.close();
        res.json(result);
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: error.message });
    }
});


// Train Model using Flask API via Node.js
app.get('/train-model', async (req, res) => {
    try {
        const response = await axios.get(`${FLASK_API_URL}/train`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Predict bed requirements for March, April, May
app.get('/predict-beds', async (req, res) => {
    try {
        // Fixed input months: October - February
        const inputMonths = ["October", "November", "December", "January", "February"];

        // Send request to Flask API with predefined input
        const response = await axios.post(`${FLASK_API_URL}/predict`, {
            months: inputMonths  // Sending fixed months as input
        });

        res.json(response.data); // Expecting predictions for March, April, May
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Node.js server running on port ${PORT}`));
