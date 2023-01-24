import './App.css';
import Navbar from './Profile/Navbar';
import React,{useEffect,useState} from 'react';
import { ethers } from 'ethers';
import {
  Provider,createClient,configureChains, useConnect, useDisconnect,
  useAccount,
  usePrepareContractWrite,
  useNetwork,useContractRead, useSwitchNetwork,WagmiConfig
} from 'wagmi'
import ABI from "./Solidity/DomainsABI.json";
import MyContextProvider from './MyContextProvider';
import Domains from './Domains'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
function App(props) {
  const { address, connector, isConnected } = useAccount()
  const { chain } = useNetwork()
  const [mintPOH, setMintPOH] = useState("");
  const check = async () => {
    if(chain){
    let valueHTTP=props.chains.find(networkValue => chain.id === networkValue.id).rpcUrls.default.http;
    const provider = new ethers.providers.JsonRpcProvider(
      valueHTTP[0].http
    );
    const contract = new 
    ethers.Contract(
      process.env.REACT_APP_SMART_CONTRACT_FIL
    ,ABI,
    provider);
    let value= await contract.getDomainAddress(address);
    if (!value) {
      setMintPOH(false);
  } else {
    setMintPOH(true);
  }
}
  };
  useEffect(() => {
    check();
  }, [address]);
  return (
    <MyContextProvider>
      <Navbar isConnected={isConnected} chains={props.chains} mintPOH={mintPOH}></Navbar>
      {
      chain ? props.chains.find(networkValue => chain.id === networkValue.id) ? isConnected ?
              <React.Fragment>
              <center>
              <Domains chains={props.chains}/>
              </center>
              </React.Fragment>:
              <React.Fragment>
              </React.Fragment>
      : "" : ""}

</MyContextProvider>
  );
}

export default App;