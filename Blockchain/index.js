require("dotenv").config();
const { ethers } = require("ethers");

// Connect to Ethereum network
const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract details
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractABI = [
    "function setNumber(uint256 _num) public",
    "function getNumber() public view returns (uint256)"
];

// Connect to the contract with the wallet
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

async function interactWithContract() {
    try {
        // Set number
        let tx = await contract.setNumber(42);
        await tx.wait();
        console.log("Number set successfully!");

        // Get number
        let number = await contract.getNumber();
        console.log("Stored Number:", number.toString());
    } catch (error) {
        console.error("Error interacting with contract:", error);
    }
}

interactWithContract();
