import { useState } from 'react';
import { ethers } from 'ethers';

// The exact message the server expects
const SIGN_IN_MESSAGE = "Welcome to the Club! Please sign this message to verify your wallet ownership.";

export default function App() {
  // Track where the user is in the flow
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'granted', 'denied'
  const [errorMessage, setErrorMessage] = useState('');
  const [walletAddress, setWalletAddress] = useState('');

  const connectAndVerify = async () => {
    setStatus('loading');
    setErrorMessage('');

    // 1. Check if the user has a wallet installed
    if (!window.ethereum) {
      setErrorMessage("No crypto wallet found. Please install MetaMask.");
      setStatus('idle');
      return;
    }

    try {
      // 2. Connect to the wallet (The Notary)
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);

      // 3. Request the signature
      const signature = await signer.signMessage(SIGN_IN_MESSAGE);

      // 4. Send the address and signature to your backend
      const response = await fetch('http://localhost:3000/verify-nft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: address,
          signature: signature
        })
      });

      const data = await response.json();

      // 5. Handle the server's decision
      if (response.ok && data.authorized) {
        setStatus('granted');
      } else {
        setStatus('denied');
        setErrorMessage(data.message || "Access denied.");
      }

    } catch (error) {
      console.error(error);
      setStatus('idle');
      // If the user clicks "Reject" in MetaMask, it throws an error we can catch
      if (error.code === 'ACTION_REJECTED') {
        setErrorMessage("You rejected the signature request.");
      } else {
        setErrorMessage("An error occurred during verification.");
      }
    }
  };

  // --- UI RENDERING --- //

  // View 1: Access Granted (The Exclusive Dashboard)
  if (status === 'granted') {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>🎉 Welcome to the Inner Circle 🎉</h1>
        <p>Wallet Verified: {walletAddress}</p>
        <div style={{ padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '8px', marginTop: '20px' }}>
          <h3>Top Secret Alpha</h3>
          <p>This content is only visible to verified NFT holders.</p>
        </div>
        <button onClick={() => setStatus('idle')} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Log Out
        </button>
      </div>
    );
  }

  // View 2: Access Denied (The Sales Pitch)
  if (status === 'denied') {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1>🛑 Access Restricted 🛑</h1>
        <p style={{ color: 'red' }}>{errorMessage}</p>
        <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px', marginTop: '20px' }}>
          <h3>You don't own the required NFT.</h3>
          <p>To access this dashboard, you must hold the club pass.</p>
          <a href="#" style={{ display: 'inline-block', marginTop: '10px', padding: '10px 20px', backgroundColor: '#d32f2f', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>
            Mint / Buy the NFT Here
          </a>
        </div>
        <button onClick={() => setStatus('idle')} style={{ marginTop: '20px', padding: '10px 20px' }}>
          Try Again
        </button>
      </div>
    );
  }

  // View 3: Default Login Screen ('idle' or 'loading')
  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>The Exclusive Club Gate</h1>
      <p>Please verify your wallet to proceed.</p>
      
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
      <button 
        onClick={connectAndVerify} 
        disabled={status === 'loading'}
        style={{ padding: '15px 30px', fontSize: '18px', cursor: status === 'loading' ? 'not-allowed' : 'pointer' }}
      >
        {status === 'loading' ? 'Verifying...' : 'Connect Wallet & Sign In'}
      </button>
    </div>
  );
}