// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DataIntegrity {
    event DataStored(address indexed user, bytes32 dataHash, string collectionName, uint256 timestamp);

    function storeData(bytes32 dataHash, string memory collectionName) external {
        emit DataStored(msg.sender, dataHash, collectionName, block.timestamp);
    }
}
