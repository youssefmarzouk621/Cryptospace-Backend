const ConvertLib = artifacts.require("ConvertLib");
const VaultCoin = artifacts.require("VaultCoin");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, VaultCoin);
  deployer.deploy(VaultCoin);
};
