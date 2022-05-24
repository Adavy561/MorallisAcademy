pragma solidity 0.7.5;

contract onlyOwnable {
  
  address payable internal owner; 
   
   constructor () {
       owner = msg.sender;
   }
   
    modifier onlyOwner {
       require(msg.sender == owner);
       _;
   }
}
   
contract EtherBankv2 {
    
    mapping(address => mapping(uint => bool)) idSigned;
}
