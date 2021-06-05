pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/VaultCoin.sol";

contract TestVaultCoin {
    function testInitialBalanceUsingDeployedContract() public {
        VaultCoin meta = VaultCoin(DeployedAddresses.VaultCoin());

        uint expected = 10000;

        Assert.equal(
            meta.getBalance(msg.sender),
            expected,
            "Owner should have 10000 VaultCoin initially"
        );
    }

    function testInitialBalanceWithNewVaultCoin() public {
        VaultCoin meta = new VaultCoin();

        uint expected = 10000;

        Assert.equal(
            meta.getBalance(address(this)),
            expected,
            "Owner should have 10000 VaultCoin initially"
        );
    }
}
