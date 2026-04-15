require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers'); 
const app = express();

// Local development, this is fine, but in production you should set up proper CORS policies
const cors = require('cors');
app.use(cors());

app.use(express.json());

// 1. Connection to the Blockchain
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contractAddress = process.env.LEFTY_NFT_ADDR;
const abi = [ "function balanceOf(address owner) view returns (uint256)" ];
const nftContract = new ethers.Contract(contractAddress, abi, provider);

// 2. The exact message the frontend will ask the user to sign
const SIGN_IN_MESSAGE = "Welcome to the Club! Please sign this message to verify your wallet ownership.";

app.post('/verify-nft', async (req, res) => {
  // We now expect both the address AND the cryptographic signature
  const { walletAddress, signature } = req.body;

  if (!walletAddress || !signature) {
    return res.status(400).json({ authorized: false, message: "Missing address or signature" });
  }

  try {
    // 3. Verify the signature to prove ownership of the address
    const recoveredAddress = ethers.verifyMessage(SIGN_IN_MESSAGE, signature);

    // If the recovered address doesn't match the claimed address, abort.
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ authorized: false, message: "Invalid signature. Authentication failed." });
    }

    // 4. Query the Smart Contract directly from the Server
    const balance = await nftContract.balanceOf(walletAddress);
    
    if (balance > 0n) { // Note: ethers v6 returns BigInts, so we use > 0n
      // User owns the NFT and proved they own the wallet
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