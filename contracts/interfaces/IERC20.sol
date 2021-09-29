pragma solidity ^0.8.0;

interface IERC20 {
  function transfer(address to, uint value) external returns (bool);
  function balanceOf(address owner) external returns (uint);
  function allowance(address owner, address spender) external view returns (uint);
  function transferFrom(address from, address to, uint value) external returns (bool);
}
