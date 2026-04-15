const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying LeftyNFT with account:", deployer.address);

    const LNFTFactory = await ethers.getContractFactory("LeftyNFT");
    const lnfty = await LNFTFactory.deploy();

    await lnfty.waitForDeployment();

    console.log("Contract deployed at address: ", lnfty.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
