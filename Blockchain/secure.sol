// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataIntegrity {
    struct DataRecord {
        bytes32 dataHash;
        uint256 timestamp;
    }

    mapping(address => DataRecord[]) public userRecords;
    
    event DataStored(address indexed user, bytes32 dataHash, uint256 timestamp);

    function storeData(bytes32 dataHash) external {
        userRecords[msg.sender].push(DataRecord(dataHash, block.timestamp));
        emit DataStored(msg.sender, dataHash, block.timestamp);
    }

    function getUserRecords(address user) external view returns (DataRecord[] memory) {
        return userRecords[user];
    }
}
