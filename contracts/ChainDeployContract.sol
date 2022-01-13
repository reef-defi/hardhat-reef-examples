//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Creator {
  address[] public items;
  
  function addItem(string memory _name) public payable returns (address childAddr) {
    Child child = new Child(_name);
    childAddr = address(child);
    console.log("child address:", childAddr);
    items.push(childAddr);
  }
}

contract Child {
  string private name;
  uint private val;

  constructor(string memory _name) {
    name = _name;
    val = 1;
  }

  function getName() public view returns(string memory) {
    return name;
  }

  function getAddress() public view returns(address) {
    return address(this);
  }
}