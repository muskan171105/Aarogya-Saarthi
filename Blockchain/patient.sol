// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientRecords {
    // Struct to hold patient record metadata
    struct PatientRecord {
        string dataHash;       // Hash of the patient data (SHA-256)
        string ipfsHash;       // IPFS CID for off-chain storage
        address addedBy;       // Address of the entity that added the record
        uint256 timestamp;     // Timestamp of when the record was added
    }

    // Mapping of patient IDs to their records
    mapping(uint256 => PatientRecord) public records;

    // Address of the contract owner (e.g., hospital admin)
    address public owner;

    // Event to log when a new record is added
    event RecordAdded(uint256 patientId, string dataHash, string ipfsHash, address addedBy);

    // Modifier to restrict access to the owner
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    // Constructor to set the owner
    constructor() {
        owner = msg.sender;
    }

    // Function to add a new patient record
    function addRecord(uint256 patientId, string memory dataHash, string memory ipfsHash) public onlyOwner {
        require(bytes(records[patientId].dataHash).length == 0, "Record already exists for this patient ID");

        records[patientId] = PatientRecord({
            dataHash: dataHash,
            ipfsHash: ipfsHash,
            addedBy: msg.sender,
            timestamp: block.timestamp
        });

        emit RecordAdded(patientId, dataHash, ipfsHash, msg.sender);
    }

    // Function to verify a patient record
    function verifyRecord(uint256 patientId, string memory dataHash) public view returns (bool) {
        return keccak256(abi.encodePacked(records[patientId].dataHash)) == keccak256(abi.encodePacked(dataHash));
    }
}
