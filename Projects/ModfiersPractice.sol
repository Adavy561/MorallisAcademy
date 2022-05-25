pragma solidity 0.7.5;

contract RequireAssertPractice {

    mapping(address => uint) balance;
    address owner;
    
    modifier onlyOwner { //optional include onlyOwner() can put anything in parenthesis like uint or strings
        require(msg.sender == owner); 
        _; //runs the function, in theory _is replaced by actual code in function
    }
    //modifiers are placed at the beginning of a function, similar to public and returns
    
    modifier costs(uint price) {
        require(msg.value >= price);
        _;
    }
    
    constructor (){
        owner = msg.sender;
        // like a function but executes in the beginning of the smart contract
        // sets owner to the address of user who created smart contract
    }
    
    function addBalance(uint _toAdd) public onlyOwner returns (uint) {
        balance[msg.sender] += _toAdd;
        return balance[msg.sender];
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