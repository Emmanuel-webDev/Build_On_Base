// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.24 <= 0.9.16;

    contract ErrHandling{

    //using revert
      error NotEnoughFunds(uint req, uint bal);
      mapping (address => uint) public balances;

     function pay(uint _balance) public{
        balances[msg.sender] = 10;
        if(balances[msg.sender] < _balance)
        revert NotEnoughFunds(_balance, balances[msg.sender]);
        balances[msg.sender] -= _balance;
    }

    //using require
      function send(uint _amt) public {
          balances[msg.sender] = 10;
          require (balances[msg.sender] >= _amt, "NotEnoughFunds");
          balances[msg.sender] -= _amt;
        }

}

