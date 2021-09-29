pragma solidity ^0.8.0;

import "./Lighthouse.sol";
import "./interfaces/IERC20.sol";

contract IgnorantSender {
  Lighthouse immutable lighthouse;
  constructor(address _lighthouse) {
    lighthouse = Lighthouse(_lighthouse);
  }

  function transferFunds(address token, uint amount) public {
    IERC20(token).transfer(lighthouse.harbor(), amount);
    /// Self destructing should yield a gas refund, but it appears the cost
    /// of including this line in the bytecode is more than the refund amount
    /// gas cost with self destruct: 224631
    /// gas cost without self destruct: 217041
    /// using eth-gas-reporter so may be incorrect
    // selfdestruct(payable(address(0)));
  }
}
