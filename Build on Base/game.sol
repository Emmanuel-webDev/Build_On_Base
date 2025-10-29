// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

//Simple guessing game with leaderboard. leaderboard displays user address and correct number of guesses, also displays the current logged in users detials on the leaderboard

contract GuessGame {
    //Generated Value
    uint public generatedNum;

    //Stores a user data
    struct User {
        address user;
        bool isRegistered;
        uint guessCount;
        uint amountWon;
    }

    //Maps current user address to it's data
    mapping(address => User) public usersInfo;

    //Array to hold all users
    address[] public allPlayers;

    //Event to handle wrong guess
    event GuessFailed(uint guess, uint answer);

    function play(uint num) public {
        // If first time playing → register user once
        if (!usersInfo[msg.sender].isRegistered) {
            usersInfo[msg.sender].user = msg.sender;
            usersInfo[msg.sender].isRegistered = true;
            allPlayers.push(msg.sender);
        }

        usersInfo[msg.sender].guessCount += 1;

        uint randomNum = uint(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)
            )
        );

        //Generatd value
        generatedNum = (randomNum % 100);

        if (num == generatedNum) {
            usersInfo[msg.sender].amountWon += 1;
        } else {
            emit GuessFailed(num, generatedNum);
        }
    }

    function leaderBoard()
        public
        view
        returns (
            address[] memory players,
            uint[] memory guesses,
            uint[] memory corrects
        )
    {
        uint length = allPlayers.length;

        players = new address[](length);
        guesses = new uint[](length);
        corrects = new uint[](length);

        for (uint i = 0; i < length; i++) {
            address playerAddr = allPlayers[i];
            players[i] = playerAddr;
            guesses[i] = usersInfo[playerAddr].guessCount;
            corrects[i] = usersInfo[playerAddr].amountWon;
        }
    }
}
