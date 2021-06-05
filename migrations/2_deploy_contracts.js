const ConvertLib = artifacts.require("ConvertLib");
const AstroCash = artifacts.require("AstroCash");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, AstroCash);
  deployer.deploy(AstroCash);
};
