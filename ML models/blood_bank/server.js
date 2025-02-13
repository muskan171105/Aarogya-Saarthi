const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3001;

// MongoDB connection
const url = "mongodb+srv://Prarabdh:db.prarabdh.soni@prarabdh.ezjid.mongodb.net/";
const dbName = "AarogyaSaarthi";  // Replace with your database name
const collectionName = "BloodBank";  // Replace with your collection name

const client = new MongoClient(url);

// Mapping of blood type IDs to blood group names
const bloodTypeMap = {
    1: "O+",
    2: "A+",
    3: "B+",
    4: "AB+",
    5: "O-",
    6: "A-",
    7: "B-",
    8: "AB-"
};

app.get("/blood_data", async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        const data = await collection.find({ "Types of blood": { $in: Object.keys(bloodTypeMap).map(Number) } }).toArray();

        const result = data.map(doc => ({
            "Blood Type": bloodTypeMap[doc["Types of blood"]],
            "Output": doc["Output"]
        }));

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching data");
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/blood_data`);
});
