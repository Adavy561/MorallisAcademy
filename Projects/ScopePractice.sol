pragma solidity 0.7.5;

contract ScopePractice {
    
    //string message = "Hello World"; 
    //variable has been declared globally
    
    
    //state variable
    string message; //value of _message
    
    constructor(string memory _message) {
        message = _message;
    }
    
    function hello(int number) public returns(string memory) { //pure means that function does not interact with any other part of the contract
        //string memory message = "Hello World";
        
        //msg.sender == 0x696969696969  -- contains ethereum address
        //msg.value  -- contains value of a transaction on the blockchain
        
        if(msg.sender == 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4) {
            return message;
        }
        else {
            return "Wrong Input";
        }
        return message;
    }
}