// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

//Simple guessing game with leaderboard. leaderboard displays user address and correct number of guesses, also displays the current logged in users detials on the leaderboard

contract GuessGame{
    //Value user Guessed
    uint public num;

    //Generated value
    uint public randomNum;

    //Stores a user data
        struct User{
            address user;
            uint guessCount;
            uint amountWon;
        }
    //Maps current user address to it's data
        mapping(address => User) public usersInfo;

    function generateNum() public view returns(uint){
            randomNum = return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % 100;
    }    

    function check() public {

    }
}