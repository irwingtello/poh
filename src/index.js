import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { WagmiConfig,configureChains, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

const { chains, provider } = configureChains(
  [
    {
      id: 31415,
      name: 'Filecoin Wallaby Testnet',
      network: 'wallaby testnet',
      nativeCurrency: {
      decimals: 18,
      name: 'Filecoin',
      symbol: 'Fil',
      },
      rpcUrls: {
      default: { http: ['https://wallaby.node.glif.io/rpc/v0'] },
      },
      blockExplorers: {
      default: { name: 'Glif', url: 'https://explorer.glif.io/wallaby' },
      },
    }
  ],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: `https://wallaby.node.glif.io/rpc/v0`
      }),
    }),
  ],
)
const client = createClient({
  autoConnect: true,
  provider: provider,
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
    <App />
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
