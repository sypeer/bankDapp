/* Test file for Bank of Wei Solidity contract */

// Import Artifact
var BankOfWei = artifacts.require('./BankOfWei.sol')

contract('BankOfWei', function(accounts) {

  // Assign accounts and amountss
  const satoshi = accounts[1];
  const vitalik = accounts[2];
  const deposit = web3.utils.toBN(5);
  const withdrawal = web3.utils.toBN(4);

  // Initiate instance
  beforeEach(async function() {
    instance = await BankOfWei.new();
  });

  // Registeration test
  it('Checking customer registration', async function() {
    await instance.register({from: vitalik});
    const registered = await instance.checkRegistration(vitalik, {from:vitalik});
    assert.equal(registered, true, 'Customer is not registered');
  });

  // Balance test
  it('Checking customer balance', async function() {
    await instance.register({from: vitalik});
    const balance = await instance.getBalance({from: vitalik});
    assert.equal(balance, 0, 'Balance should be 0 for new customers');
  });

  // Deposit test
  it('Checking deposit functionality', async function() {
    await instance.register({from: vitalik});
    await instance.depositWei(deposit, {from: vitalik});
    const balance = await instance.getBalance({from: vitalik});
    assert.equal(balance, 5, 'Amount deposited is incorrect, check deposit method');
  });

  // Check withdrawal
  it('Checking withdrawal functionality', async function() {
    await instance.register({from: vitalik});
    await instance.depositWei(deposit, {from: vitalik});
    await instance.withdrawWei(withdrawal, {from:vitalik});
    const balance = await instance.getBalance({from: vitalik});
    assert.equal(balance, 1, 'Amount withdrawn is incorrect, check withdrawal method');
  });

  // Check withdrawal limit
  it('Checking overdraw error', async function() {
    await instance.register({from: vitalik});
    await instance.depositWei(deposit, {from: vitalik});
    try {
      await instance.withdrawWei(deposit + 1, {from: vitalik});
    } catch (error) {
      assert.throws(() => { throw new Error(error) }, Error);
    };
  });

  // Check transfer
  it('Checking customer transfer', async function() {
    await instance.register({from: vitalik});
    await instance.register({from: satoshi});
    await instance.depositWei(deposit, {from: vitalik});
    await instance.transferWei(satoshi, withdrawal, {from: vitalik});
    const balance = await instance.getBalance({from:satoshi});
    assert.equal(balance, 4, 'Transfered amount is incorrect, check tranfer method');
  });

});
