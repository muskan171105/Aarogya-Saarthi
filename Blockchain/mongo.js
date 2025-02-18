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

    // Check if MongoDB supports Change Streams
    const isReplicaSet = await mongoose.connection.db.admin().serverStatus();
    if (!isReplicaSet.repl) {
      console.error('MongoDB is not running as a replica set. Change Streams require a replica set.');
      process.exit(1);
    }

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
    console.log(`Attempting to store hash for ${collectionName}: ${dataHash}`);

    // Check wallet balance
    const balance = await provider.getBalance(wallet.address);
    if (ethers.utils.formatEther(balance) < 0.001) {
      console.error("Insufficient ETH balance. Please add funds to the wallet.");
      return;
    }

    // Check if the contract is deployed
    const contractCode = await provider.getCode(process.env.CONTRACT_ADDRESS);
    if (contractCode === "0x") {
      console.error("Contract is not deployed at the given address.");
      return;
    }

    // Estimate gas limit with a 20% buffer
    const estimatedGasLimit = await contract.estimateGas.storeData(dataHash, collectionName);
    const gasLimitWithBuffer = estimatedGasLimit.mul(120).div(100); // Increase by 20%

    console.log(`Estimated Gas Limit: ${estimatedGasLimit.toString()}`);
    console.log(`Using Gas Limit with Buffer: ${gasLimitWithBuffer.toString()}`);

    const tx = await contract.storeData(dataHash, collectionName, {
      gasLimit: gasLimitWithBuffer
    });
    console.log(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`Transaction mined! Block: ${receipt.blockNumber}, Tx Hash: ${tx.hash}`);
  } catch (error) {
    console.error(`Error storing hash for ${collectionName}:`, error);
  }
}

// Watch all collections in MongoDB
async function watchAllCollections() {
  try {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.warn("⚠ No collections found in the database.");
      return;
    }

    console.log("Watching collections:", collections.map(c => c.name));

    collections.forEach(async (collection) => {
      const changeStream = db.collection(collection.name).watch([], { fullDocument: "updateLookup" });

      changeStream.on("change", async (change) => {
        console.log(`Detected change in ${collection.name}:`, JSON.stringify(change, null, 2));

        if (["insert", "update"].includes(change.operationType)) {
          const doc = change.fullDocument;
          if (doc) {
            const dataHash = generateHash(doc);
            console.log(`Generated hash: ${dataHash}`);
            await storeHashOnBlockchain(dataHash, collection.name);
          } else {
            console.log(`No valid document found in ${collection.name}`);
          }
        }
      });

      changeStream.on("error", (error) => {
        console.error(`Error in Change Stream for ${collection.name}:`, error);
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
