import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Wallet from './components/Wallet';
import TokenList from './components/TokenList';
import NFTViewer from './components/NFTViewer'; 
import Social from './components/Social';
import '../src/index.css';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);

          const storedAccount = localStorage.getItem('account');
          const storedSignature = localStorage.getItem('signature');
          console.log("Account from localStorage:", storedAccount);
          console.log("Signature from localStorage:", storedSignature);

          if (storedAccount && storedSignature) {
            setAccount(storedAccount);
            setSignedIn(true);
            const signer = provider.getSigner();
            setSigner(signer);
          } else {
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              const signer = provider.getSigner();
              setSigner(signer);
              setSignedIn(true); 
            }
          }

          window.ethereum.on('accountsChanged', async (accounts) => {
            if (accounts.length > 0) {
              const signer = provider.getSigner();
              setSigner(signer);
              setAccount(accounts[0]);
              setSignedIn(true);
            } else {
              setSigner(null);
              setAccount(null);
              setSignedIn(false);
              localStorage.removeItem('account');
              localStorage.removeItem('signature');
            }
          });

          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          });
        } else {
          alert("MetaMask not detected. Please install it.");
        }
      } catch (error) {
        console.error("Error initializing app:", error);
        alert("Failed to initialize app. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const connect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        setSigner(signer);
        const account = await signer.getAddress();
        setAccount(account);

        const message = "Web3 Ini Gratis Bisa Di Pake Untuk Siapa Saja Bisa Buat Traking Isi Wallet Kalian Di Jaringan Multichain ( JANGAN DI RENAME BOSQU BIKIN NYA CAPE BELAJAR NGODING SENDIRI USAHA PAKE OTAK ) ( Create : retrunvoid )";
        const signature = await signer.signMessage(message);
        console.log("Signature:", signature);

        localStorage.setItem('account', account);
        localStorage.setItem('signature', signature);

        setSignedIn(true);
        console.log("Signed in successfully.");
      } catch (error) {
        console.error("User rejected request or an error occurred:", error);
        alert("Failed to connect wallet. Please try again.");
      }
    } else {
      alert("MetaMask not detected. Please install it.");
    }
  };

  const disconnect = () => {
    setSigner(null);
    setAccount(null);
    setSignedIn(false);
    localStorage.removeItem('account');
    localStorage.removeItem('signature');
  };

  return (
    <div className="App">
      <div className="Iam">
        <h1>Web3 Balance tracking</h1>
      </div>
      <div className="button-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {account ? (
              signedIn ? (
                <button className="btn-2" onClick={disconnect}>🦊 Disconnect Wallet</button>
              ) : (
                <button onClick={connect}>🦊 Sign Message</button>
              )
            ) : (
              <button className="btn-2" onClick={connect}>🦊 Connect Wallet</button>
            )}
          </>
        )}
      </div>
      {account && signedIn && (
        <div className="container">
          <div className="left">
            <Wallet account={account} provider={provider} />
          </div>
          <div className="right">
            <TokenList account={account} provider={provider} />
            {/* Tambahkan komponen NFTViewer di sini */}
            <NFTViewer contractAddress="0xYourNFTContractAddress" account={account} />
          </div>
        </div>
      )}
      <Social />
    </div>
  );
}

export default App;
