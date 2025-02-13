const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const PORT = 3001;
const MONGO_URI = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/";

const client = new MongoClient(MONGO_URI);
const dbName = "AarogyaSaarthi";
const collectionName = "BloodBank";

// Blood type mapping
const bloodTypeMapping = {
    1: "A+",
    2: "A-",
    3: "B+",
    4: "B-",
    5: "AB+",
    6: "AB-",
    7: "O+",
    8: "O-"
};

app.get("/blood-requirement", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const data = await collection.find({}, { projection: { _id: 0, "Types of blood": 1, Output: 1 } }).toArray();

        if (!data.length) {
            return res.status(404).json({ error: "No data available" });
        }

        let bloodDemand = {};

        data.forEach(entry => {
            let bloodType = bloodTypeMapping[entry["Types of blood"]];
            let demand = entry["Output"] || 0;

            if (bloodType) {  // Exclude "Unknown" entries
                bloodDemand[bloodType] = (bloodDemand[bloodType] || 0) + demand;
            }
        });

        res.json(bloodDemand);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
