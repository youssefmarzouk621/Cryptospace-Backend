const VaultCoin = artifacts.require("VaultCoin");

module.exports = function(deployer) {
  deployer.deploy(VaultCoin);
};
