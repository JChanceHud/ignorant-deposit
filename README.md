# Ignorant Deposit

An ERC20 deposit strategy requiring only 1 transaction from the user.

## Strategy

The ignorant deposit protocol uses the CREATE2 opcode to give each user a unique deposit address for all tokens. This address is called the ignorant deposit address.

A user transfers a token to their ignorant deposit address for the target contract.

At some point in the future the target contract may claim the tokens from an ignorant deposit address by performing a CREATE2 operation that creates a contract at the ignorant address. This contract can only transfer tokens from the ignorant contract to the target contract. The ignorant contract can be created and self destructed in the same transaction to reclaim gas. A system expecting many deposits may leave the contract in place, lazily creating ignorant deposit contracts for users.

## Gas cost

The conventional strategy of using `transferFrom` costs about 60k gas (105k gas including the user `approve` transaction). Claiming funds from an ignorant address costs about 220k gas, or 3.6x more (2.1x more including `approve` tx).

**However** claims from an ignorant contract can be batched (e.g. wait for 5 deposits then claim). The ignorant contract can be treated as the account for a user depending on asset movement needs (instead of using a mapping).

If the ignorant contract is not self-destructed subsequent deposits are cheaper. The default flow is `approve` -> `transferFrom` (costing ~105k gas). The ignorant flow with an existing contract would be `transfer` -> `transfer` (costing ~93k gas and still requiring only 1 user transaction).

```sh
·-----------------------------------|---------------------------|---------------|-----------------------------·
|        Solc version: 0.8.4        ·  Optimizer enabled: true  ·  Runs: 99999  ·  Block limit: 30000000 gas  │
····································|···························|···············|······························
|  Methods                                                                                                    │
···············|····················|·············|·············|···············|···············|··············
|  Contract    ·  Method            ·  Min        ·  Max        ·  Avg          ·  # calls      ·  eur (avg)  │
···············|····················|·············|·············|···············|···············|··············
|  Depositor   ·  claimByIgnorance  ·          -  ·          -  ·       224631  ·            2  ·          -  │
···············|····················|·············|·············|···············|···············|··············
|  Depositor   ·  claimByTransfer   ·          -  ·          -  ·        58826  ·            2  ·          -  │
···············|····················|·············|·············|···············|···············|··············
|  Lighthouse  ·  setHarbor         ·          -  ·          -  ·        45979  ·            2  ·          -  │
···············|····················|·············|·············|···············|···············|··············
|  TestToken   ·  approve           ·          -  ·          -  ·        46105  ·            2  ·          -  │
···············|····················|·············|·············|···············|···············|··············
|  TestToken   ·  mint              ·      50837  ·      50849  ·        50843  ·            4  ·          -  │
···············|····················|·············|·············|···············|···············|··············
|  TestToken   ·  transfer          ·          -  ·          -  ·        46686  ·            2  ·          -  │
···············|····················|·············|·············|···············|···············|··············
|  Deployments                      ·                                           ·  % of limit   ·             │
····································|·············|·············|···············|···············|··············
|  Depositor                        ·     674009  ·     674249  ·       674129  ·        2.2 %  ·          -  │
····································|·············|·············|···············|···············|··············
|  Lighthouse                       ·          -  ·          -  ·       178786  ·        0.6 %  ·          -  │
····································|·············|·············|···············|···············|··············
|  TestToken                        ·          -  ·          -  ·       618656  ·        2.1 %  ·          -  │
·-----------------------------------|-------------|-------------|---------------|---------------|-------------·
```
