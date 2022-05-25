pragma solidity 0.7.5;

contract ScopePractice {

    function count(int number) public pure returns(int) {
      for(int i = 0; i < 10; i++){
          number++;
      }
      return number
    }
} 
    
/*    function count(int number) public pure returns(int) {
      int i = 0;
       while(i < 10) {
           //console.log("looping. i is" + i)
           number++;  //number = number + 1
           i++;
       }
       return number;
    }
} */