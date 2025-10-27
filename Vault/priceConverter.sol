// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
  
  function getPrice() internal view returns (uint256) {
                AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
                (, int256 price, , ,) = priceFeed.latestRoundData();
                return uint256(price * 1e10);
  }

  function getConversion (uint256 mininWei) internal view returns (uint256) {
      uint ethPrice = getPrice();
      uint256 ethAmount = (mininWei * ethPrice) / 1e18;
      return ethAmount;
  }

}
