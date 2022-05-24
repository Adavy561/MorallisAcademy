// inheritable contract
contract Ownable {
    address payable internal owner;
    
     modifier onlyOwner { //optional include onlyOwner() can put anything in parenthesis like uint or strings
        require(msg.sender == owner); 
        _; //runs the function, in theory _is replaced by actual code in function
    }
    
    constructor (){
        owner = msg.sender;
        // like a function but executes in the beginning of the smart contract
        // sets owner to the address of user who created smart contract
    }
}
