// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

//Simple guessing game with leaderboard. leaderboard displays user address and correct number of guesses, also displays the current logged in users detials on the leaderboard

contract GuessGame{

    //Generated value
    uint public generatedNum;

    //Stores a user data
        struct User{
            address user;
            bool isRegistered;
            uint guessCount;
            uint amountWon;
        }


    //Maps current user address to it's data
        mapping(address => User) public usersInfo;


    //Array to hold all users
    User[] public allPlayers;

    function generateNum() public{
        uint randomNum = uint(keccak256(abi.encodePacked(block.timestamp,block.prevrandao,msg.sender)));
        generatedNum = (randomNum % 100);
    }    

    function play(uint num) public{

     // If first time playing → register user once
    if (!usersInfo[msg.sender].isRegistered) {
        usersInfo[msg.sender].user = msg.sender;
        usersInfo[msg.sender].isRegistered = true;
        allPlayers.push(usersInfo[msg.sender]);
    }

      usersInfo[msg.sender].guessCount += 1;
     
     if(num == generatedNum){
        usersInfo[msg.sender].amountWon += 1;
     }
    

    }
}