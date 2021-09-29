pragma solidity ^0.8.0;

/// Acts as the beacon for ignorant contracts
/// e.g. we can't know the address of the deposit contract if the bytecode
/// depends on it's own address
contract Lighthouse {
  address admin;
  address public harbor;

  constructor(address _admin) {
    admin = _admin;
  }

  function setHarbor(address newHarbor) public {
    require(msg.sender == admin);
    harbor = newHarbor;
  }

  function renounceOwnership() public {
    require(msg.sender == admin);
    admin = address(0);
  }
}
