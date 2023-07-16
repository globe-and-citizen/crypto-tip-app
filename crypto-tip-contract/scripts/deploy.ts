import {ethers, upgrades} from "hardhat";

async function main() {

    const CryptoTip = await ethers.getContractFactory("CryptoTip");
    const cryptoTip = await upgrades.deployProxy(CryptoTip, {initializer: 'initialize'});

    await cryptoTip.deployed();

    console.log(
        `CryptoTip is deployed to ${cryptoTip.address}`
    );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
