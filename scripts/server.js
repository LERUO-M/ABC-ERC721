require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const app = express();

// Allow requests from the React frontend (file://, localhost on any port)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());

const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contractAddress = '0xD77E08C4D7F220c2849123aBf3803379041F164c';
const abi = ["function balanceOf(address owner) view returns (uint256)"];
const nftContract = new ethers.Contract(contractAddress, abi, provider);

// Store nonces in memory (one per wallet address)
const nonces = {};

// Build the human-readable message the user will sign
function buildMessage(address, nonce) {
  return [
    "Welcome to ABC NFT Login.",
    "",
    "Please sign this message to verify ownership of your wallet.",
    "This request will not trigger a blockchain transaction or cost any gas.",
    "",
    `Wallet:    ${address}`,
    `Nonce:     ${nonce}`,
    `Issued at: ${new Date().toUTCString()}`,
  ].join("\n");
}

// ── Step 1: Request a challenge nonce ──────────────────────────────
app.get('/nonce/:address', (req, res) => {
  const address = req.params.address.toLowerCase();
  const nonce = ethers.hexlify(ethers.randomBytes(16));
  nonces[address] = nonce;
  const message = buildMessage(address, nonce);
  res.json({ nonce, message });
});

// ── Step 2: Submit signed message + check NFT ownership ────────────
app.post('/verify-nft', async (req, res) => {
  const { walletAddress, signature } = req.body;
  const address = walletAddress.toLowerCase();

  // Check we issued a nonce for this address
  const nonce = nonces[address];
  if (!nonce) {
    return res.status(400).json({ error: "Request a nonce first via GET /nonce/:address" });
  }

  try {
    // Rebuild the exact message the client was given and recover the signer
    const message = buildMessage(address, nonce);
    const recoveredAddress = ethers.verifyMessage(message, signature).toLowerCase();

    // The recovered address MUST match the claimed wallet
    if (recoveredAddress !== address) {
      return res.status(401).json({ error: "Signature mismatch — you don't own this wallet" });
    }

    // Nonce is single-use — delete it to prevent replay attacks
    delete nonces[address];

    // Now check NFT balance
    const balance = await nftContract.balanceOf(walletAddress);
    if (balance > 0n) {
      res.json({ authorized: true, message: "Access Granted" });
    } else {
      res.status(403).json({ authorized: false, message: "No NFT found" });
    }

  } catch (error) {
    res.status(500).json({ error: "Verification failed", details: error.message });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));