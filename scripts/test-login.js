const { ethers } = require('ethers');
const privateKey = process.env.PRIVATE_KEY; 

// Create a wallet instance using the private key
const wallet = new ethers.Wallet(privateKey);
const wallet2 = new ethers.Wallet(process.env.NEXT_USER_PRIVATE_KEY);

// Message to be signed
const SIGN_IN_MESSAGE = process.env.SIGN_IN_MESSAGE;

async function runTest() {
    console.log(`Testing authentication for wallet: ${wallet.address}...`);

    try {
        // Generate the cryptographic signature (Stamping the wax)
        const signature = await wallet.signMessage(SIGN_IN_MESSAGE);
        console.log("\nSignature generated successfully!");

        // Send the POST request to your local server
        const response = await fetch('http://localhost:5173/verify-nft', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // We send the address and the generated signature
            body: JSON.stringify({
                walletAddress: wallet.address,
                signature: signature
            })
        });

        const data = await response.json();
        
        // 5. Output the results
        console.log(`\nServer Status Code: ${response.status}`);
        console.log("Server Response:", data);

    } catch (error) {
        console.error("Error running test:", error.message);
    }
}

runTest();