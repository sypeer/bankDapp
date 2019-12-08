const BankOfWei = artifacts.require("BankOfWei");

module.exports = function(deployer) {
  deployer.deploy(BankOfWei);
};
