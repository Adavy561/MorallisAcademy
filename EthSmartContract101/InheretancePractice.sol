pragma solidity 0.7.5;

import "./Ownable.sol"; //imports file from below

contract EtherBank is Ownable {

    mapping(address => uint) balance;
    
    event depositDone(uint amount, address indexed depositedTo); //indexed means search ether nodes for whatever happened previously
   
    //modifiers are placed at the beginning of a function, similar to public and returns
    
    modifier costs(uint price) {
        require(msg.value >= price);
        _;
    }
    
    uint depositAmount;
    
    function deposit() public payable returns (uint) {
        balance[msg.sender] += msg.value; //mapping is to keep track of internal balance of accounts
        emit depositDone(msg.value, msg.sender);
        return balance[msg.sender];
    }
    
    function withdraw(uint amount) public onlyOwner returns (uint) {
        //msg.sender is an address
       // address payable toSend = 0x617F2E2fD72FD9D5503197092aC168c91465E7f2;
       // toSend.transfer(amount);
       
       require(amount <= balance[msg.sender]);
        msg.sender.transfer(amount);
        return amount;
    }
    
    function getBalance() public view returns (uint){
        return balance[msg.sender];
    }
    
    function transfer(address recipient, uint amount) public {
        require(balance[msg.sender] >= amount, "Balance not sufficient."); // can add a second part of require() that will return a custom error message for debug
        require(msg.sender != recipient, "Don't send money to yourself.");
        //check balance of msg.sender
        
        uint previousSenderBalance = balance[msg.sender];
        
       _transfer(msg.sender, recipient, amount);
        
        assert(balance[msg.sender] == previousSenderBalance - amount); // checks to make sure balance of msg.sender = initial balance - amount sent
        //event logs and further checks
    }
    
    function _transfer(address from, address to, uint amount) private {
        balance[from] -= amount;
        balance[to] += amount;
    }
}
