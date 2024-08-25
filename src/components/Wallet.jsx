import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import eth from '../assets/logos/eth.jpg';
import ens from '../assets/logos/ens.jpg';

function Wallet({ account, provider }) {
  const [balance, setBalance] = useState('Loading...');
  const [balanceInUSD, setBalanceInUSD] = useState('Loading...');
  const [ensName, setEnsName] = useState('No ENS name found');
  const [gasPrice, setGasPrice] = useState('Loading...');
  const [seconds, setSeconds] = useState(14);
  const [blockNumber, setBlockNumber] = useState('Loading...');
  const [dateTime, setDateTime] = useState(new Date().toLocaleString());

  useEffect(() => {
    const fetchBalanceAndPrice = async () => {
      if (provider && account) {
        try {
          // Fetch wallet balance
          const balance = await provider.getBalance(account);
          const balanceInEther = ethers.utils.formatEther(balance);
          setBalance(balanceInEther);
          
          // Fetch ETH price in USD from CryptoCompare
          const response = await axios.get(
            `https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=USD&api_key=048e8cc5f710aef34ef891172eb7e95866b0cb60c2ea896e3a2684a4caaebf3a`
          );
          const ethPriceInUSD = response.data.ETH.USD;
          const balanceUSD = (balanceInEther * ethPriceInUSD).toFixed(2);
          setBalanceInUSD(balanceUSD);
        } catch (error) {
          console.error('Error fetching balance or price:', error);
          setBalance('Error');
          setBalanceInUSD('Error');
        }

        try {
          const network = await provider.getNetwork();
          if (network.name === 'homestead' || network.name === 'ropsten' || network.name === 'goerli') {
            const name = await provider.lookupAddress(account);
            setEnsName(name || 'No ENS name found');
          } else {
            setEnsName('ENS not supported on this network');
          }
        } catch (error) {
          console.error('Error fetching ENS name:', error);
          setEnsName('Error');
        }
      }
    };

    const fetchGasPrice = async () => {
      try {
        const response = await axios.get(
          'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=PRYP3I2E9B4TKB14IYA2C53T36WUR82N2X'
        );
        const gasPriceInGwei = response.data.result.SafeGasPrice;
        setGasPrice(gasPriceInGwei);
      } catch (error) {
        console.error('Error fetching gas price:', error);
        setGasPrice('Error');
      }
    };

    const fetchBlockNumber = async () => {
      try {
        const blockNumber = await provider.getBlockNumber();
        setBlockNumber(blockNumber);
      } catch (error) {
        console.error('Error fetching block number:', error);
        setBlockNumber('Error');
      }
    };

    const updateDateTime = () => {
      setDateTime(new Date().toLocaleString());
    };

    fetchBalanceAndPrice();
    fetchGasPrice();
    fetchBlockNumber();
    updateDateTime();

    const gasInterval = setInterval(() => {
      fetchGasPrice();
      setSeconds(14);
    }, 14000);

    const blockInterval = setInterval(() => {
      fetchBlockNumber();
    }, 14000); // Update block number every 14 seconds

    const countdownInterval = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 14));
    }, 1000);

    const dateTimeInterval = setInterval(() => {
      updateDateTime();
    }, 1000);

    return () => {
      clearInterval(gasInterval);
      clearInterval(blockInterval);
      clearInterval(countdownInterval);
      clearInterval(dateTimeInterval);
    };
  }, [provider, account]);

  return (
    <div className="wallet-info">
      <p className='wallet'>{account}</p>
      <p className='ENS'>
        <img src={ens} alt="ENS Logo" />
        ENS: {ensName}
      </p>
      <p className='ethereum-balance'>
        <img src={eth} alt="Ethereum Logo" />
        <span>
          Ethereum: {balance}
          <span className="usdt">
            $ {balanceInUSD}
          </span>
        </span>
      </p>
      <p className="refresh-info">
        <i className="fas fa-cog fa-spin"></i>
        Refresh in {seconds}s: Gas Price {gasPrice} Gwei
      </p>
      <p className="refresh-info">
        <i className="fas fa-cog fa-spin"></i>
        Block Number: {blockNumber}
      </p>
      <p className="refresh-info">
        <i className="fas fa-cog fa-spin"></i>
        Date and Time: {dateTime}
      </p>
    </div>
  );
}

export default Wallet;
