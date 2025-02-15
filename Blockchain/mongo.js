require('dotenv').config();
const { ethers } = require('ethers');
const mongoose = require('mongoose');

// MongoDB Connection
async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    mongoose.connection.on("disconnected", () => {
      console.log("⚠ MongoDB disconnected! Reconnecting...");
      setTimeout(connectMongoDB, 5000);
    });

  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
}

// Ethereum Setup
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const abi = [
  "function storeData(bytes32 dataHash, string memory collectionName) external",
  "function getUserRecords(address user) external view returns (tuple(bytes32, string)[])"
];
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

// Function to generate hash from JSON data
function generateHash(data) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(data)));
}

// Function to store hash on Ethereum
async function storeHashOnBlockchain(dataHash, collectionName) {
  try {
    console.log(`Storing hash for ${collectionName}: ${dataHash}`);
    const tx = await contract.storeData(dataHash, collectionName);
    await tx.wait();
    console.log(`Hash stored successfully for ${collectionName}: ${dataHash}`);
  } catch (error) {
    console.error(`Error storing hash for ${collectionName}:`, error);
  }
}

// Watch all collections in MongoDB
async function watchAllCollections() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log("Watching collections:", collections.map(c => c.name));

    collections.forEach(async (collection) => {
      const changeStream = db.collection(collection.name).watch([], { fullDocument: "updateLookup" });

      changeStream.on("change", async (change) => {
        try {
          console.log(`Change detected in ${collection.name}:`, change);

          if (["insert", "update"].includes(change.operationType)) {
            const doc = change.fullDocument;
            if (doc) {
              const dataHash = generateHash(doc);
              await storeHashOnBlockchain(dataHash, collection.name);
            } else {
              console.log(`No valid document found in ${collection.name}`);
            }
          }
        } catch (error) {
          console.error(`Error processing change in ${collection.name}:`, error);
        }
      });
    });
  } catch (error) {
    console.error("Error watching collections:", error);
  }
}

// Start process
(async () => {
  await connectMongoDB();
  await watchAllCollections();
})();
