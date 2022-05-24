pragma solidity 0.7.5;

contract DataLocation {
    
    //3 ways to store data
    //storage - data that remains PERSISTANT over time and function executions 
    //Example: state variables
    uint data = 123; // stored in storage
    string lastText = "Hello Aidan";
    
    //memory - TEMPORARY data storage, stored as long as the function runs
    
    //calldata - similar to memory but read only, cannot be overwritten
    //used for static variables you should never overwrite
    
    
    function getString(string memory text) public view returns(string memory) {
        //uint secondNumber = 20; //variables declared in function are only saved while used in function, goes for all variables
        string memory newString = lastText; 
        newString = text;
        return text;
    }
    
}
