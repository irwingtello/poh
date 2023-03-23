import "./App.css";
import Navbar from "./Profile/Navbar";
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import {
  Provider,
  createClient,
  configureChains,
  useConnect,
  useDisconnect,
  useAccount,
  usePrepareContractWrite,
  useNetwork,
  useContractRead,
  useSwitchNetwork,
  WagmiConfig,
} from "wagmi";
import ABI from "./Solidity/Domains.json";
import MyContextProvider from "./MyContextProvider";
import Domains from "./Domains";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./page/Home";

function App(props) {
  const ethers = require('ethers');

const provider = new ethers.providers.JsonRpcProvider('https://api.hyperspace.node.glif.io/rpc/v1'); // connect to an Ethereum node
const addressX = '0x8B98F8Ff69d2A720120eD6C71A9Bc5072b8Eb46D'; // the address you want to retrieve NFTs from
const contractAddress = '0xFAE1379bFA98F31A79Fc109Fb0c8A15B271ABe02'; // the address of the ERC-721 token contract
const contractABI = []
const contract = new ethers.Contract(contractAddress, contractABI, provider);

async function retrieveNFTs() {
  /*
	const balance = await contract.balanceOf(addressX); // get the balance of the address
	console.log("----");
	console.log(balance);
	console.log("----");
	
	for (let i = 0; i < balance; i++) {
	  const tokenId = await contract.tokenOfOwnerByIndex(addressX, i); // get the token ID
	  //const tokenURI = await contract.tokenURI(tokenId); // get the token URI
	  //console.log(`NFT ${tokenId}: ${tokenURI}`);
      console.log(`NFT ${tokenId}`);
	}
	
	*/
  }
  

  const { address, connector, isConnected } = useAccount();
  const { chain } = useNetwork();
  const [mintPOH, setMintPOH] = useState("");
  const check = async () => {
    if (chain) {
      let valueHTTP = props.chains.find(
        (networkValue) => chain.id === networkValue.id
      ).rpcUrls.default.http;
      const provider = new ethers.providers.JsonRpcProvider(valueHTTP[0].http);
      const contract = new ethers.Contract(
        process.env.REACT_APP_SMART_CONTRACT_DOMAINS_FIL,
        ABI,
        provider
      );
      let value = await contract.getDomainAddress(address);
      if (!value) {
        setMintPOH(false);
      } else {
        setMintPOH(true);
      }
    }
  };
  useEffect(() => {
    check();
    retrieveNFTs();
  }, [address]);
  return (
    <MyContextProvider>
      <Navbar
        isConnected={isConnected}
        chains={props.chains}
        mintPOH={mintPOH}
      ></Navbar>

      {chain ? (
        props.chains.find((networkValue) => chain.id === networkValue.id) ? (
          isConnected ? (
            <React.Fragment>
              <center>
				<Home chains={props.chains} isConnected={isConnected}/>
              </center>
            </React.Fragment>
          ) : (
            <React.Fragment></React.Fragment>
          )
        ) : (
          ""
        )
      ) : (
        <Home />
      )}
    </MyContextProvider>
  );
}

export default App;
