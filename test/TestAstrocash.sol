pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/AstroCash.sol";

contract TestAstroCash {
    function testInitialBalanceUsingDeployedContract() public {
        AstroCash meta = AstroCash(DeployedAddresses.AstroCash());

        uint expected = 10000;

        Assert.equal(
            meta.getBalance(msg.sender),
            expected,
            "Owner should have 10000 AstroCash initially"
        );
    }

    function testInitialBalanceWithNewAstroCash() public {
        AstroCash meta = new AstroCash();

        uint expected = 10000;

        Assert.equal(
            meta.getBalance(address(this)),
            expected,
            "Owner should have 10000 AstroCash initially"
        );
    }
}
