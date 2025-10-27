// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

contract Voting {
    uint public optA;
    uint public optB;
    uint public optC;
    uint public total;

    enum Options {
        A,
        B,
        C
    }

    mapping(address => bool) public hasVoted;

    struct Voters {
        address voter;
        Options choice;
    }

    Voters[] public voters;

    function cast(uint x) public {
        require(x <= uint(Options.C), "Invalid option");

        Options choice = Options(x);

      

        if (choice == Options(0)) {
            optA += 1;
        } else if (choice == Options(1)) {
            optB += 1;
        } else if (choice == Options(2)) {
            optC += 1;
        }
        
        hasVoted[msg.sender] = true;
        
        total++;
    }

    function getVoteCount() public view returns (uint, uint, uint, uint) {
        return (optA, optB, optC, total);
    }

    function check() public view returns (bool){
         
         return hasVoted[msg.sender];
    
    }
}
