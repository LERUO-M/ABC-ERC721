# ABC ERC-721 NFT Login

A wallet-gated login page built with React, Express, and ERC-721. Users connect their MetaMask wallet, sign a human-readable challenge message, and the backend verifies they hold a **LeftNFT** on Sepolia before granting access.

## Why ERC-721?

- ERC-721 = a unique ID card
- One person owns it
- It proves who you are
- You either have it or you don't

## Project Structure

```
contracts/       - LeftNFT ERC-721 smart contract
scripts/
  deploy.js      - Hardhat deployment script
  server.js      - Express API (nonce + NFT verification)
client/
  index.html     - React login frontend
```

## Prerequisites

- [Node.js](https://nodejs.org) v18+
- [MetaMask](https://metamask.io) browser extension
- A `.env` file in the project root with:

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

## Steps to Run

### 1. Install dependencies

```bash
npm install
```

### 2. Start the backend server

```bash
node scripts/server.js
```

The API will be available at `http://localhost:3000`.

### 3. Serve the frontend

Open a second terminal and run:

```bash
npx serve client
```

Then open the URL printed in the terminal (e.g. `http://localhost:3001`) in your browser.

> **Note:** MetaMask requires the page to be served over `http://` - opening `client/index.html` directly as a `file://` URL will not work.

### 4. Use the app

1. Click **Connect Wallet** and approve the MetaMask prompt.
2. Click **Verify NFT Ownership** - MetaMask will show a human-readable message to sign. Review it and confirm.
3. If your wallet holds a LeftNFT on Sepolia, you will see the **Access Granted** success screen.

## Contract

- **Name:** LeftNFT (LNFT)
- **Network:** Sepolia testnet
- **Address:** `0xD77E08C4D7F220c2849123aBf3803379041F164c`

## How Verification Works

1. Frontend requests a one-time nonce from `GET /nonce/:address`. The server returns both the raw nonce and a pre-built human-readable message.
2. MetaMask displays the readable message to the user, who signs it with their private key (`personal_sign`). The message includes the wallet address, the nonce, and a timestamp so users can see exactly what they are agreeing to.
3. Frontend posts the signature to `POST /verify-nft`.
4. Backend rebuilds the same message from the stored nonce and recovers the signer using `ethers.verifyMessage`. The recovered address must match the claimed wallet.
5. The nonce is deleted after use to prevent replay attacks.
6. Backend calls `balanceOf` on the NFT contract - access is granted only if the balance is greater than zero.
