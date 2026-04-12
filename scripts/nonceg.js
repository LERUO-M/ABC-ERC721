const { ethers } = require("ethers");
const wallet = new ethers.Wallet("0x6dd0a0a894dc8632a177dfc13be0bdadd08036ca");
const signature = await wallet.signMessage("0x853320eabd17af119b86931822717355"); // the nonce from step 1
console.log(signature);