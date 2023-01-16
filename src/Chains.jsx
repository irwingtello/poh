import { Chain } from "wagmi";

export const wallabyTestnet: Chain = {
    id: 31415,
    name: 'Filecoin Wallaby Testnet',
    network: 'wallaby testnet',
    nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'tFIL',
    },
    rpcUrls: {
    default: { http: ['https://wallaby.node.glif.io/rpc/v0'] },
    },
    blockExplorers: {
    default: { name: 'Glif', url: 'https://explorer.glif.io/wallaby' },
    },
    testnet: true,
};


export const filecoinMainnet: Chain = {
    id: 31414,
    name: 'Filecoin Mainnet',
    network: 'wallaby testnet',
    nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'tFIL',
    },
    rpcUrls: {
    default: { http: ['https://wallaby.node.glif.io/rpc/v0'] },
    },
    blockExplorers: {
    default: { name: 'Glif', url: 'https://explorer.glif.io/wallaby' },
    },
    testnet: true,
};
