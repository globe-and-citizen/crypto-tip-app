// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract CryptoTip is OwnableUpgradeable, ReentrancyGuardUpgradeable {
    using SafeMathUpgradeable for uint256;

    mapping(address => uint256) public balances;
    uint8 public pushLimit;
    uint256 remainder;

    event TipsSent(address payable [] teamMembers, uint256 amount);
    event TipsPushed(address payable [] teamMembers, uint256 amount);

    function initialize() initializer public {
        __Ownable_init();
        pushLimit = 10;
    }

    function sendTips(address payable[] calldata teamMembers) external payable {
        require(teamMembers.length > 0, "Must have at least one team member");
        require(msg.value > 0, "Must send some ETH");

        uint totalAmount = msg.value + remainder;
        uint amountPerMember = totalAmount.div(teamMembers.length);
        remainder = totalAmount.mod(teamMembers.length);

        for (uint i = 0; i < teamMembers.length; i++) {
            uint amountToSend = amountPerMember;
            balances[teamMembers[i]] = balances[teamMembers[i]].add(amountToSend);
        }

        emit TipsSent(teamMembers, totalAmount);
    }


    function pushTips(address payable[] calldata teamMembers) external payable {
        require(teamMembers.length > 0, "Must have at least one team member");
        require(msg.value > 0, "Must send some ETH");
        require(pushLimit >= teamMembers.length, "You have too much team members");

        uint totalAmount = msg.value + remainder;
        uint amountPerMember = totalAmount.div(teamMembers.length);
        remainder = totalAmount.mod(teamMembers.length);

        for (uint i = 0; i < teamMembers.length; i++) {
            uint amountToSend = amountPerMember;
            require(address(this).balance >= amountToSend, "Insufficient contract balance");

            (bool sent,) = teamMembers[i].call{value: amountToSend}("");
            require(sent, "Failed to send ETH");
        }

        emit TipsPushed(teamMembers, totalAmount);
    }

    function updatePushLimit(uint8 value) external onlyOwner {
        pushLimit = value;
    }

    function getBalance(address wallet) external view returns (uint256) {
        return balances[wallet];
    }

    function withdraw() external nonReentrant {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "No balance to withdraw");

        balances[msg.sender] = 0;
        (bool sent,) = msg.sender.call{value: balance}("");
        require(sent, "Failed to send ETH");
        require(balances[msg.sender] == 0, "Failed to zero out balance");
    }
}
