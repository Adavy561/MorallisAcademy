pragma solidity 0.7.5;

contract ArrayPractice {
 
    int[] numbers; //int[3] numbers = [2, 5, 6]; to instantiate with set array 
    
    function addNumber(int _number) public {
        numbers.push(_number);
        //numbers[0] =_ number; -- inserts numbers into the array
    }
    
    function getNumber(uint _index) public view returns(int) {  //returns a number based on what space in array
        return numbers[_index];
    }
     
    function getArray() public view returns(int[] memory) {  //returns whole array
        return numbers;
    }
}