require("dotenv").config();
const { ethers } = require("ethers");
const mongoose = require("mongoose");

// Load environment variables
const MONGO_URI = process.env.MONGO_URI;
const INFURA_RPC_URL = process.env.INFURA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({ any: {} }, { strict: false });
const UserModel = mongoose.model("User", UserSchema);

// Ethereum Setup
const provider = new ethers.JsonRpcProvider(INFURA_RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const abi = [
    "function storeData(bytes32 dataHash) external",
    "function getUserRecords(address user) external view returns (tuple(bytes32, uint256)[])"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);

// Function to store data hash on Ethereum
async function storeHashOnBlockchain(userAddress, dataHash) {
    try {
        const tx = await contract.storeData(dataHash);
        await tx.wait();
        console.log(`Stored hash on Ethereum: ${dataHash}`);
    } catch (error) {
        console.error("Error storing hash:", error);
    }
}

// Function to generate hash from JSON data
function generateHash(userData) {
    return ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(userData)));
}

// Watch for MongoDB changes
async function watchMongoDB() {
    console.log("Watching MongoDB for changes...");

    const changeStream = UserModel.watch();
    changeStream.on("change", async (change) => {
        console.log("Change detected:", change);

        if (change.operationType === "insert" || change.operationType === "update") {
            const userData = change.fullDocument || await UserModel.findById(change.documentKey._id);
            const userAddress = userData.walletAddress; // Assuming each user has a wallet address stored
            const dataHash = generateHash(userData);

            await storeHashOnBlockchain(userAddress, dataHash);
        }
    });
}

watchMongoDB();
