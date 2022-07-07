pragma solidity 0.7.5;
contract MemoryAndStorage {

    mapping(uint => User) users; // array that points id number to user struct

    struct User{
        uint id; // id number for users
        uint balance; // amount contained in user account
    }
    

    function addUser(uint id, uint balance) public {
        users[id] = User(id, balance);
    }

    function updateBalance(uint id, uint balance) public {
       users[id].balance = balance; //takes balance from user struct and adds balance variable to current balance in array
    }

    function getBalance(uint id) view public returns (uint) {
        return users[id].balance;
    }

}
