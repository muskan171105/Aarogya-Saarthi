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
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  }
}

// List MongoDB collections
async function listCollections() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("📂 Collections in MongoDB:", collections.map(c => c.name));
  } catch (error) {
    console.error("❌ Error fetching collections:", error);
  }
}

// Fetch first 5 documents from each collection
async function fetchData() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    for (let collection of collections) {
      const col = db.collection(collection.name);
      const data = await col.find({}).limit(5).toArray();
      console.log(`📄 Collection: ${collection.name} - Data:`, data);
    }
  } catch (error) {
    console.error("❌ Error fetching data:", error);
  }
}

// Ethereum Provider (Using Alchemy)
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const abi = [
  "function storeData(bytes32 dataHash) external",
  "function getUserRecords(address user) external view returns (tuple(bytes32, uint256)[])"
];
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

// Function to store data hash on Ethereum
async function storeHashOnBlockchain(dataHash) {
  try {
    const tx = await contract.storeData(dataHash);
    await tx.wait();
    console.log(`✅ Stored hash on Ethereum: ${dataHash}`);
  } catch (error) {
    console.error("❌ Error storing hash:", error);
  }
}

// Function to generate hash from JSON data
function generateHash(userData) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(userData)));
}

// Function to fetch stored hashes from Ethereum
async function getStoredHashes() {
  try {
    const records = await contract.getUserRecords(process.env.TEST_USER_ADDRESS);
    console.log(`📜 Stored records for ${process.env.TEST_USER_ADDRESS}:`, records);
    return records;
  } catch (error) {
    console.error("❌ Error fetching stored hashes:", error);
    return [];
  }
}

// Function to verify if a hash exists on Ethereum
async function verifyStoredHash() {
  try {
    const patientData = await mongoose.connection.db.collection("Patient").findOne();
    if (!patientData) {
      console.log("⚠️ MongoDB is empty. No data to verify.");
      return;
    }
    const generatedHash = generateHash(patientData);
    const storedHashes = await getStoredHashes();
    if (storedHashes.some(([hash]) => hash === generatedHash)) {
      console.log("✅ Hash is correctly stored on Ethereum!");
    } else {
      console.log("❌ Hash not found on Ethereum!");
    }
  } catch (error) {
    console.error("🚨 Error verifying stored hash:", error);
  }
}

// Watch for MongoDB changes
async function watchMongoDB() {
  console.log("👀 Watching MongoDB for changes...");
  try {
    const changeStream = mongoose.connection.db.collection("Patient").watch();
    changeStream.on("change", async (change) => {
      console.log("🔄 Change detected:", change);
      if (change.operationType === "insert" || change.operationType === "update") {
        const userData = change.fullDocument || await mongoose.connection.db.collection("Patient").findOne({_id: change.documentKey._id});
        if (userData) {
          const dataHash = generateHash(userData);
          await storeHashOnBlockchain(dataHash);
        } else {
          console.log("⚠️ No valid user data found. Skipping.");
        }
      }
    });
  } catch (error) {
    console.error("❌ Error watching MongoDB:", error);
  }
}

// Function to run MongoDB sync
async function startSync() {
  console.log("🚀 Starting MongoDB Sync with Ethereum...");
  await watchMongoDB();
  console.log("✅ Sync started. Watching for updates...");
}

// Main execution
(async () => {
  await connectMongoDB();
  await listCollections();
  await fetchData();
  await startSync();
  await verifyStoredHash();
})();
