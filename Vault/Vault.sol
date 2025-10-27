// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "Vault/priceConverter.sol";

contract Onchainsaving{
    //State Variables

    uint public mininWei =  515000000000000; //Equivalent to $2 in WEI
    mapping (address => uint) public balances;
    address public owner = 0xC0477B7C64fB76C4f5dFc083c9113D59556f5222;
    uint public totalDeposited = 0;

    struct Savers{
        address addy;
        uint amount;
        uint createdAt;
    }

    Savers[] public saversInfo;

   function fund() public payable {
      require(PriceConverter.getConversion(msg.value)>= mininWei,"You need to deposit more ETH");

    saversInfo.push(Savers({
         addy: msg.sender, 
         amount: PriceConverter.getConversion(msg.value),
         createdAt: block.timestamp
         }));

    totalDeposited += PriceConverter.getConversion(msg.value);

    balances[msg.sender] += msg.value;
   }

   function getInfo () public view Admin returns(Savers[] memory, uint256){
         return (saversInfo, totalDeposited);
   }


    function withdraw() public {
      require(balances[msg.sender] > 0, "You have no funds to withdraw");

        uint withAmt = balances[msg.sender];
        balances[msg.sender] = 0;
        totalDeposited -= withAmt;

        for(uint i = 0; i < saversInfo.length; i++){
            if(saversInfo[i].addy == msg.sender){
               saversInfo[i].amount = 0;
               break;
            }

        }
    
        (bool success, ) = payable(msg.sender).call{value: withAmt}("");
        require(success, "Withdraw Failed");

}


    modifier Admin(){
        require(owner == 0xC0477B7C64fB76C4f5dFc083c9113D59556f5222, "You're not authorized");
        _;
    }

}