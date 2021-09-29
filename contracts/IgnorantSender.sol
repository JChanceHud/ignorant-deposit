pragma solidity ^0.8.0;

import "./interfaces/IERC20.sol";

contract IgnorantSender {
  address immutable receiver;
  constructor(address _receiver) {
    receiver = _receiver;
  }

  function transferFunds(address token, uint amount) public {
    IERC20(token).transfer(receiver, amount);
    /// Self destructing should yield a gas refund, but it appears the cost
    /// of including this line in the bytecode is more than the refund amount
    /// gas cost with self destruct: 180325
    /// gas cost without self destruct: 172735
    /// using eth-gas-reporter so may be incorrect
    // selfdestruct(payable(address(0)));
  }
}
