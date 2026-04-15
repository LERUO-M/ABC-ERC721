# ABC ERC-721 NFT Login - "The Inner Circle"

A premium wallet-gated login experience built with **React**, **Express**, **ethers.js**, and **ERC-721**. Users connect their MetaMask wallet, cryptographically sign a challenge message, and the backend verifies they hold a **LeftyNFT** on Sepolia testnet before granting access to exclusive content.

## 🎯 How It Works

1. User clicks **Connect Wallet & Sign In**
2. MetaMask prompts them to sign a human-readable message (proves wallet ownership)
3. Backend verifies the signature and checks NFT balance on-chain
4. ✅ If they hold an NFT → **Access Granted** screen with exclusive content
5. ❌ If no NFT → **Access Denied** screen with vault animation + call-to-action

## 🏗️ Project Structure

```
ABC-ERC721/
├── scripts/
│   ├── server.js              # Express backend (signature verification + NFT check)
│   ├── deploy.js              # Hardhat deployment script
│   └── test-login.js          # Testing utilities
├── frontend-loveable/         # Production frontend (Vite + React + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   │   └── NftGate.tsx    # Main auth component (with animations)
│   │   ├── lib/
│   │   ├── routes/
│   │   └── styles.css
│   └── vite.config.ts
├── nft_access/                # Alternative frontend (simpler Vite setup)
│   ├── src/
│   │   └── App.jsx            # Basic login component
│   └── vite.config.js
└── README.md (this file)
```

## 🔐 Smart Contract

- **Name:** LeftyNFT (LNFT)
- **Network:** Sepolia Testnet
- **Address:** `0xd614eEC2C666c412484cf3a31Ea3D8e57186624D`
- **Standard:** ERC-721 (NFT verification via `balanceOf`)

## 📋 Prerequisites

- **Node.js** v18+
- **MetaMask** browser extension
- A `.env` file in the project root with:

```
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
```

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

This installs packages for both the backend and frontend.

### Step 2: Start the Backend Server

```bash
node scripts/server.js
```

The API will be available at `http://localhost:3000`

You should see: `Server running on http://localhost:3000`

### Step 3: Start the Frontend

Open a **second terminal** and run:

#### Option A: Premium Frontend (Recommended - with animations)

```bash
cd frontend-loveable
npm install
npm run dev
```

#### Option B: Simple Frontend

```bash
cd nft_access
npm install
npm run dev
```

Both will print a local URL (usually `http://localhost:5173`) — open it in your browser.

### Step 4: Test the Login Flow

1. Click **Connect Wallet & Sign In** / **Connect Wallet**
2. MetaMask will display the message to sign:
3. Review and confirm the signature
4. If your wallet holds a LeftNFT → **Access Granted** ✅
5. If not → **Access Denied** + vault animation 🔐

## 🔄 Authentication Flow

### Frontend (React)

```
User clicks button
  ↓
MetaMask prompts to sign message
  ↓
Frontend sends (address, signature) to backend
  ↓
Display loading state...
```

### Backend (Express)

```
POST /verify-nft receives (address, signature)
  ↓
Recover signer from signature using ethers.verifyMessage()
  ↓
Verify recovered address matches claimed address
  ↓
Query contract: balanceOf(address)
  ↓
If balance > 0 → 200 OK { authorized: true }
If balance = 0 → 403 { authorized: false }
```

## 🎨 Frontend Features

### Production Frontend (`frontend-loveable`)
- **Smooth animations** with Framer Motion
- **Glassmorphism** design with modern UI components
- **Three distinct states:**
  - 💎 **Idle**: Login screen with floating particles
  - ⏳ **Loading**: Animated spinner + verifying state
  - ✅ **Granted**: Welcome screen with exclusive content
  - 🔐 **Denied**: Access denied with vault door animation + CTA

### Simple Frontend (`nft_access`)
- Lightweight, React
- No animations—focus on core functionality
- Great for testing or customization

## 🛠️ Development Commands

```bash
# Install all dependencies
npm install

# Start backend
node scripts/server.js

# Start frontend (production)
cd frontend-loveable && npm run dev

# Start frontend (simple)
cd nft_access && npm run dev

# Build frontend for production
cd frontend-loveable && npm run build
```

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + TypeScript + Vite |
| **Animation** | Framer Motion |
| **Web3** | ethers.js v6 |
| **Backend** | Express.js + Node.js |
| **Blockchain** | Ethereum (Sepolia Testnet) |
| **Smart Contract** | Solidity (ERC-721) |

## 🔍 How Signature Verification Works

1. **Frontend** requests user to sign a fixed message via MetaMask (`personal_sign`)
2. **User** reviews the readable message and confirms
3. **Frontend** sends the signature + wallet address to backend
4. **Backend** uses `ethers.verifyMessage(message, signature)` to recover the signer
5. If recovered address = claimed address → ✅ Proven wallet ownership
6. **Contract query** checks if `balanceOf(address) > 0` → Access decision

This prevents replay attacks and proves the user controls the private key.