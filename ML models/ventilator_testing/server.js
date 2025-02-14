import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const PORT = 3001;
app.use(cors());

// Replace with your MongoDB connection string
const MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/";
const DATABASE_NAME = "AarogyaSaarthi";
const COLLECTION_NAME = "Ventilator";

let db;

// Connect to MongoDB
MongoClient.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db(DATABASE_NAME);
        console.log("Connected to MongoDB");
    })
    .catch(err => console.error("MongoDB Connection Error:", err));

app.get('/predict-ventilator', async (req, res) => {
    try {
        const collection = db.collection(COLLECTION_NAME);

        // Fetch first record from MongoDB
        const doc = await collection.findOne({}, { projection: { _id: 0, Oct: 1, Nov: 1, Dec: 1, Jan: 1, Feb: 1, Mar: 1, Apr: 1, May: 1 } });

        if (doc) {
            res.json({
                input_data: {
                    Oct: doc.Oct,
                    Nov: doc.Nov,
                    Dec: doc.Dec,
                    Jan: doc.Jan,
                    Feb: doc.Feb
                },
                predicted_data: {
                    Mar: doc.Mar,
                    Apr: doc.Apr,
                    May: doc.May
                }
            });
        } else {
            res.status(404).json({ message: "No records found" });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
