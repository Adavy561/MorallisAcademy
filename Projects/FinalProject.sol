pragma solidity 0.7.5;

contract ownerPerms {
   
   address payable internal owner; 
   
   constructor () {
       owner = msg.sender;
   }
   
   modifier onlyOwner {
       require(msg.sender == owner);
       _;
   }
   
   struct walletMembers { // struct containing the contract owners
       address payable ownerA; 
       address payable ownerB;
       address payable ownerC; 
   }
   
} 

contract MultiSigWallet is ownerPerms {
    
    modifier onlyOwners { // ensures only walletMembers have access to functions
       require(msg.sender == owners[0].ownerA || msg.sender == owners[0].ownerB || msg.sender == owners[0].ownerC); //ensures only 3 owners of contract get access to functions
       _;
    }
    
    mapping(string => uint) balanceContract; // ether gets deposited here
    mapping(address => uint) balancePeople; // balance of each of the owners
    string permName; // name of wallet eth is deposited to
    
    uint counter;
    uint amount;
    address withdrawRequest; //address requesting withdraw
    
    mapping(address => bool) ownerSign; 
    
    walletMembers[] owners; 
       
    event depositDone(uint amount, address indexed sender); // event broadcasts address and amount of deposit
       
    function createWallet(string memory walletName, address payable _ownerB, address payable _ownerC) public onlyOwner {
        owners.push(walletMembers(owner, _ownerB, _ownerC)); //uses owners array and pushes to allOwners struct
        balanceContract[walletName];
        permName = walletName;
        // creates wallet instance with names of 3 owners
    }
   
    function getOwners(uint _index) public view returns(address, address, address) {
        return (owners[_index].ownerA, owners[_index].ownerB, owners[_index].ownerC);
        // returns owners of indexed wallet instance
    }
    
    function depositEth() public payable {
        balanceContract[permName] += msg.value;
        emit depositDone(msg.value, msg.sender);
        // deposits eth into wallet instance
    }
       
    function getContractBalance() public view returns(uint){
        return balanceContract[permName];
        // returns balance of the wallet
    }
    
    function getBalance() public view returns(uint) {
        return balancePeople[msg.sender];
        // returns balance of address
    }
    
    function beginWithdraw(uint _amount) public {
        ownerSign[msg.sender] = true;
        withdrawRequest = msg.sender;
        amount = _amount;
        counter += 1;
        // starts transfer as well as writes first signature from the owner
    }
    
    function signWithdraw(bool sign) public onlyOwners {
        require(msg.sender != withdrawRequest);
        ownerSign[msg.sender] = sign;
        counter += 1;
        // sign from address not requesting withdraw
    }
    
    function executeWithdraw() public onlyOwners{
        require(msg.sender == withdrawRequest);
        require(counter >= 2);
        _withdraw(amount);
        counter = 0;
        // executes withdraw using _withdraw function
    }
    
    function _withdraw(uint _amount) private {
        require(balanceContract[permName] >= _amount);
        balanceContract[permName] -= _amount;
        balancePeople[msg.sender] += _amount;
    }
    
}