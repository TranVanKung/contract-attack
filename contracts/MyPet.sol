//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyPet is Ownable {
    string public myDog;

    constructor(string memory _myDog) {
        myDog = _myDog;
    }

    function updateDog(string memory _myDog) external onlyOwner {
        myDog = _myDog;
    }
}
