import logo from "./logo.svg";
import "./App.css";
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { publicProvider } from 'wagmi/providers/public'
import { Provider,createClient,configureChains,useAccount, useConnect, useDisconnect } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { Chain } from 'wagmi'
import { useNetwork } from 'wagmi'
import { WagmiConfig } from 'wagmi'
import {wallabyTestnet,hyperspaceTestnet} from './Chains.jsx'
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import MintPOH from './MintPOH'
import Domains from "./Domains";
const { chains, provider } = configureChains(
  [ hyperspaceTestnet, wallabyTestnet],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === hyperspaceTestnet.id) return { http: chain.rpcUrls.default  };
        if (chain.id === wallabyTestnet.id) return { http: chain.rpcUrls.default };
        return null;
      },
    }),
  ]
);
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  provider:provider
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
   
    <Router>
        <Routes>
        <Route exact path='/' element={ <App chains={chains} />}></Route>
        <Route exact path='/mint' element={ <MintPOH chains={chains} /> }></Route>
        <Route exact path='/domains' element={ <Domains chains={chains} /> }></Route>
        </Routes>


       </Router>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
