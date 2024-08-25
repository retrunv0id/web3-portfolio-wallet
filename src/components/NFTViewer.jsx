import React, { useEffect, useState } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import '../components/Nft.css';

const NFTViewer = ({ account }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNFTs = async (retries = 5, delay = 1000) => {
      try {
        const config = {
          apiKey: "3mBInt043uRVTdIWv3hUkQ4saQKkOEcM",
          network: Network.ETH_MAINNET,
        };
        const alchemy = new Alchemy(config);
        const nftsForOwner = await alchemy.nft.getNftsForOwner(account);

        console.log("Fetched NFTs:", nftsForOwner.ownedNfts); // Log data yang diterima

        if (nftsForOwner.ownedNfts) {
          setNfts(nftsForOwner.ownedNfts);

          // Logging data untuk debug
          nftsForOwner.ownedNfts.forEach(nft => {
            console.log("NFT name: ", nft.title || "No Title");
            console.log("Token type: ", nft.tokenType || "No Token Type");
            console.log("Token URI: ", nft.tokenUri?.gateway || "No Token URI");
            console.log("Image URL: ", nft.rawMetadata?.image || "No Image URL");
            console.log("Time Last Updated: ", nft.timeLastUpdated || "No Time Info");
            console.log("===");
          });
        }
      } catch (error) {
        if (retries > 0 && error.response?.status === 429) {
          console.warn(`Retrying... (${5 - retries + 1})`);
          setTimeout(() => fetchNFTs(retries - 1, delay * 2), delay);
        } else {
          console.error("Error fetching NFTs:", error);
          setError("Failed to fetch NFTs. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    if (account) {
      fetchNFTs();
    }
  }, [account]);

  if (loading) {
    return <div>Loading NFTs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!nfts || nfts.length === 0) {
    return <div>No NFTs found</div>;
  }

  return (
    <div>
      <h2>Nft List</h2>
    
    <div className="nft-list">
      {nfts.map((nft, index) => {
        const imageUrl = nft.image?.cachedUrl || 'https://via.placeholder.com/150';
        const title = nft.name || "Untitled NFT";
        return (
          <div key={index} className="nft-item">
            <img
              src={imageUrl}
              alt={title}
              className="nft-image"
            />
            <p>{title}</p>
          </div>
        );
      })}
    </div>
    </div>
  );
};

export default NFTViewer;
