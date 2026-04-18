require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const path = require('path');
const cors = require('cors');

const app = express();

// Middleware first — always
app.use(cors());
app.use(express.json());

// Static files + dashboard route
app.use(express.static(path.join(__dirname, 'public')));
app.get('/dashboard', (req, res) =>
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'))
);

// Blockchain setup
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contractAddress = process.env.LEFTY_NFT_ADDR;
const abi = ["function balanceOf(address owner) view returns (uint256)"];
const nftContract = new ethers.Contract(contractAddress, abi, provider);

const SIGN_IN_MESSAGE = "Welcome to the Club! Please sign this message to verify your wallet ownership.";

app.post('/verify-nft', async (req, res) => {
  const { walletAddress, signature } = req.body;

  if (!walletAddress || !signature) {
    return res.status(400).json({ authorized: false, message: "Missing address or signature" });
  }

  try {
    const recoveredAddress = ethers.verifyMessage(SIGN_IN_MESSAGE, signature);

    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ authorized: false, message: "Invalid signature. Authentication failed." });
    }

    const balance = await nftContract.balanceOf(walletAddress);

    if (balance > 0n) {
      res.status(200).json({ authorized: true, message: "Access Granted" });
    } else {
      res.status(403).json({ authorized: false, message: "No NFT found. Join the club first." });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).send("Error processing request");
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
