require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter")

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 99999,
      }
    }
  },
  gasReporter: {
    enabled: (process.env.REPORT_GAS) ? true : false,
  },
  networks: {
    goerli: {
      url: 'http://192.168.1.198:9545',
      accounts: ['0x6afb38998c73c93abfe21e137609dad96e4c0e7164a5af4e87641d7188f05f42']
    }
  },
  mocha: {
    timeout: 300000
  }
};
