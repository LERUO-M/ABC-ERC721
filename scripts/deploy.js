const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying LeftNFT with account:", deployer.address);

    const LNFTFactory = await ethers.getContractFactory("LeftNFT");
    const lnft = await LNFTFactory.deploy();

    await lnft.waitForDeployment();

    console.log("Contract deployed at address: ", lnft.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
