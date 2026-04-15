require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers'); // Common library for blockchain
const app = express();
app.use(express.json());
// 1. Connection to the Blockchain
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contractAddress = '0xD77E08C4D7F220c2849123aBf3803379041F164c';
const abi = [ "function balanceOf(address owner) view returns (uint256)" ];
const nftContract = new ethers.Contract(contractAddress, abi, provider);


app.post('/verify-nft', async (req, res) => {
  const { walletAddress } = req.body;

  try {
    // 2. Query the Smart Contract directly from the Server
    const balance = await nftContract.balanceOf(walletAddress);

    if (balance > 0) {
      // 3. Logic for "User owns the NFT"
      res.json({ authorized: true, message: "Access Granted" });
    } else {
      res.status(403).json({ authorized: false, message: "No NFT found" });
    }
  } catch (error) {
    res.status(500).send("Error checking blockchain");
  }
});
app.listen(3000, () => console.log("Server running on http://localhost:3000"));