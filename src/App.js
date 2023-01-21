
import './App.css';
import Navbar from './Profile/Navbar';
import React from 'react';
import {
  Provider,createClient,configureChains, useConnect, useDisconnect,
  useAccount,
  usePrepareContractWrite,
  useNetwork, useSwitchNetwork,WagmiConfig
} from 'wagmi'
import Domains from './Domains'
function App(props) {
  const { address, connector, isConnected } = useAccount()
  const { chain } = useNetwork()
  return (
    <React.Fragment>
      <Navbar isConnected={isConnected} chains={props.chains}></Navbar>
      {
      chain ? props.chains.find(networkValue => chain.id === networkValue.id) ? isConnected ?
              <React.Fragment>
              <center>
              <Domains/>
              </center>
              </React.Fragment>:
              <React.Fragment>
              </React.Fragment>
      : "" : ""}

    </React.Fragment>
  );
}

export default App;
