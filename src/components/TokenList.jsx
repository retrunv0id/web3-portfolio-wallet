import React, { useState, useEffect } from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ethers } from "ethers";
import axios from "axios";
import "../index.css";

import blastLogo from '../assets/logos/blast.jpg';
import scrollLogo from '../assets/logos/scroll.jpg';
import arbLogo from '../assets/logos/arb.png';
import opLogo from '../assets/logos/op.jpg';
import taikoLogo from '../assets/logos/taiko.png';
import baseLogo from '../assets/logos/base.jpg';
import lineaLogo from '../assets/logos/linea.jpg';
import zkLogo from '../assets/logos/zk.jpg';
import zoraLogo from '../assets/logos/zora.jpg';
import bnbLogo from '../assets/logos/bnb.png';
import maticLogo from '../assets/logos/matic.jpg';
import mantaLogo from '../assets/logos/manta.jpg';
import CyberMainnet from '../assets/logos/CyberMainnet.jpg'
import modeLogo from '../assets/logos/mode.jpg'
import mantleLogo from '../assets//logos/Mantle.jpg'
import okxLogo from '../assets/logos/okx.jpg'
import retrunvoid from '../assets/logos/retrunvoid.png'

const networks = {
  base: {
    name: "Base",
    provider: new ethers.providers.JsonRpcProvider("https://base.llamarpc.com"),
    symbol: "ETH",
    chainId: 8453,
    logo: baseLogo
  },
  cyber: {
    name: "Cyber",
    provider: new ethers.providers.JsonRpcProvider("https://rpc.cyber.co"),
    symbol: "ETH",
    chainId: 7560,
    logo: CyberMainnet
  },
  line: {
    name: "Linea",
    provider: new ethers.providers.JsonRpcProvider("https://1rpc.io/linea"),
    symbol: "ETH",
    chainId: 59144,
    logo: lineaLogo
  },
  arb: {
    name: "Arbitrum",
    provider: new ethers.providers.JsonRpcProvider("https://arb1.arbitrum.io/rpc"),
    symbol: "ETH",
    chainId: 42161,
    logo: arbLogo
  },
  Mode: {
    name: "Mode",
    provider: new ethers.providers.JsonRpcProvider("https://mainnet.mode.network"),
    symbol: "ETH",
    chainId: 34443,
    logo: modeLogo
  },
  taikoo: {
    name: "Taiko",
    provider: new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/taiko"),
    symbol: "ETH",
    chainId: 167004,
    logo: taikoLogo
  },
  blast: {
    name: "Blast",
    provider: new ethers.providers.JsonRpcProvider("https://rpc.blast.io"),
    symbol: "ETH",
    chainId: 81457,
    logo: blastLogo
  },
  scroll: {
    name: "Scroll",
    provider: new ethers.providers.JsonRpcProvider("https://1rpc.io/scroll"),
    symbol: "ETH",
    chainId: 534353,
    logo: scrollLogo
  },
  op: {
    name: "Optimism",
    provider: new ethers.providers.JsonRpcProvider("https://mainnet.optimism.io"),
    symbol: "ETH",
    chainId: 10,
    logo: opLogo
  },
  Okx: {
    name: "Okx",
    provider: new ethers.providers.JsonRpcProvider("https://1rpc.io/oktc"),
    symbol: "OKT",
    chainId: 66,
    logo: okxLogo
  },
  Mantle: {
    name: "Mantle",
    provider: new ethers.providers.JsonRpcProvider("https://rpc.mantle.xyz"),
    symbol: "MNT",
    chainId: 5000,
    logo: mantleLogo
  },
  zkSync: {
    name: "ZkSync",
    provider: new ethers.providers.JsonRpcProvider("https://1rpc.io/zksync2-era"),
    symbol: "ETH",
    chainId: 324,
    logo: zkLogo
  },
  zora: {
    name: "Zora",
    provider: new ethers.providers.JsonRpcProvider("https://rpc.zora.energy"),
    symbol: "ETH",
    chainId: 7777777,
    logo: zoraLogo
  },
  bnb: {
    name: "BNB",
    provider: new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/bsc"),
    symbol: "bnb",
    chainId: 56,
    logo: bnbLogo
  },
  matic: {
    name: "Matic",
    provider: new ethers.providers.JsonRpcProvider("https://polygon-rpc.com/"),
    symbol: "matic",
    chainId: 137,
    logo: maticLogo
  },
  manta: {
    name: "Manta",
    provider: new ethers.providers.JsonRpcBatchProvider("https://1rpc.io/manta"),
    symbol: "manta",
    chainId: 344,
    logo: mantaLogo
  },
};

const options = {
  method: "GET",
  headers: {
    accept: "application/json"
  }
};

function MultiNetworkBalances({ account }) {
  const [balances, setBalances] = useState([]);
  const [totalBalanceInUSDT, setTotalBalanceInUSDT] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      setLoading(true);
      let totalUSDT = 0;
    
      const balancePromises = Object.keys(networks).map(async (key) => {
        const network = networks[key];
        try {
          const balance = await network.provider.getBalance(account);
          const balanceInEther = ethers.utils.formatEther(balance);
    
          let usdtValue = 0;
          const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${network.symbol.toUpperCase()}&tsyms=USD&api_key=048e8cc5f710aef34ef891172eb7e95866b0cb60c2ea896e3a2684a4caaebf3a`;
    
          try {
            console.log(`Request URL: ${url}`); 
            const response = await axios.get(url, options);
            console.log(`Response for ${network.symbol}:`, response.data);
    
            if (response.data && response.data[network.symbol.toUpperCase()]) {
              usdtValue = response.data[network.symbol.toUpperCase()].USD || 0;
            } else {
              console.error(`No USD price found for ${network.symbol}`);
              usdtValue = 0;
            }
            
          } catch (apiError) {
            console.error(`Error fetching USDT price for ${network.symbol}:`, apiError);
            usdtValue = 0;
          }
    
          const balanceInUSDT = (balanceInEther * usdtValue).toFixed(2);
          totalUSDT += parseFloat(balanceInUSDT);
    
          return {
            network: network.name,
            symbol: network.symbol.toUpperCase(),
            balance: balanceInEther,
            balanceInUSDT: balanceInUSDT,
            logo: network.logo
          };
        } catch (error) {
          console.error(`Error fetching balance for ${network.name}:`, error);
          return {
            network: network.name,
            symbol: network.symbol.toUpperCase(),
            balance: "Error fetching balance",
            balanceInUSDT: "N/A",
            logo: network.logo
          };
        }
      });
    
      const fetchedBalances = await Promise.all(balancePromises);
      setBalances(fetchedBalances);
      setTotalBalanceInUSDT(totalUSDT.toFixed(2));
      setLoading(false);
    };    

    fetchBalances();
  }, [account]);

  return (
    <div className="container">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {balances.map((balance, index) => (
              <li key={index} className="balance-item">
                {balance.logo && 
                  <img 
                    src={balance.logo} 
                    alt={`${balance.network} logo`} 
                    className="network-logo" 
                  />}
                <span className="network">{balance.network} </span>
                <span className="balance"> {balance.balance}</span>
                <span className="usdt"> $ {balance.balanceInUSDT}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      <div className="footer">
        <div className="footer-content">
        <p span className="usdt"> Total Balance USDT : $ {totalBalanceInUSDT}</p>
          <div className="footer-logo">
            <img 
              src={retrunvoid}
              alt="Logo" 
              className="footer-logo-img"
            />
          </div>
          <p className="footer-copyright">
            【 Retrunvoid 】<br />
            Copyright © List 2024
          </p>
        </div>
      </div>
    </div>
  );
}  

export default MultiNetworkBalances;
