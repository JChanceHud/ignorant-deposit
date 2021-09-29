const { ethers } = require("hardhat");
const assert = require('assert')

describe("Depositor", function () {
  it("Should deposit tokens without approval", async function () {
    const [ owner ] = await ethers.getSigners();
    const Depositor = await ethers.getContractFactory('Depositor')
    const depositor = await Depositor.deploy()
    await depositor.deployed()

    const TestToken = await ethers.getContractFactory('TestToken')
    const testToken = await TestToken.deploy()
    await testToken.deployed()

    const DEFAULT_AMOUNT = 100000

    const mintTx = await testToken.connect(owner).mint(DEFAULT_AMOUNT)
    await mintTx.wait()

    const depositAddress = await depositor.depositAddress(owner.address)

    const transferTx = await testToken.connect(owner).transfer(depositAddress, 1000)
    await transferTx.wait()

    const ingestTx = await depositor.claimByIgnorance(owner.address, testToken.address, 1000)
    await ingestTx.wait()

    const ownerTokenBalance = await testToken.balanceOf(owner.address)
    const depositorTokenBalance = await testToken.balanceOf(depositor.address)
    const ignorantTokenBalance = await testToken.balanceOf(depositAddress)

    console.log(`owner balance: ${ownerTokenBalance}`)
    console.log(`depositor balance: ${depositorTokenBalance}`)
    console.log(`ignorant balance: ${ignorantTokenBalance}`)
    assert.equal(+ownerTokenBalance, DEFAULT_AMOUNT - 1000)
    assert.equal(+depositorTokenBalance, 1000)
    assert.equal(+ignorantTokenBalance, 0)
  });

  it("Should compare cost of performing transferFrom", async () => {
    const [ owner ] = await ethers.getSigners();
    const Depositor = await ethers.getContractFactory('Depositor')
    const depositor = await Depositor.deploy()
    await depositor.deployed()

    const TestToken = await ethers.getContractFactory('TestToken')
    const testToken = await TestToken.deploy()
    await testToken.deployed()

    const DEFAULT_AMOUNT = 100000

    const mintTx = await testToken.connect(owner).mint(DEFAULT_AMOUNT)
    await mintTx.wait()

    const approveTx = await testToken.connect(owner).approve(depositor.address, 1000)
    await approveTx.wait()

    const claimTx = await depositor.claimByTransfer(owner.address, testToken.address)
    await claimTx.wait()

    const ownerTokenBalance = await testToken.balanceOf(owner.address)
    const depositorTokenBalance = await testToken.balanceOf(depositor.address)

    assert.equal(+ownerTokenBalance, DEFAULT_AMOUNT - 1000)
    assert.equal(+depositorTokenBalance, 1000)
  })
});
