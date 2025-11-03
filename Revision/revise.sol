// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract testing {
    mapping(string => mapping(address => uint256)) public myMapping;

    struct Person {
        string name;
        uint256 age;
    }

    mapping(address => Person) public user;

    function addUser(string memory x, uint y ) public {
         user[msg.sender] = Person(x,y);
    }

    function getUser() public view returns (Person memory) {
       return user[msg.sender];
    }


    function set(
        string memory str,
        address adr,
        uint256 val
    ) public {
        myMapping[str][adr] = val;
    }

    function get(string memory str, address adr) public view returns (uint256) {
        return myMapping[str][adr];
    }
}
