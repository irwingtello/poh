
import './App.css';
import Navbar from './Profile/Navbar';
import React from 'react';
import { Provider,createClient,configureChains,useAccount, useConnect, useDisconnect } from 'wagmi'
import { WagmiConfig } from 'wagmi'

function App() {
  const { address, connector, isConnected } = useAccount()
  return (
    <React.Fragment>
      <Navbar isConnected={isConnected}></Navbar>
      {
        isConnected?<React.Fragment></React.Fragment>:<React.Fragment></React.Fragment>
      }
    </React.Fragment>
  );
}

export default App;
