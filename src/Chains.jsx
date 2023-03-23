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
    default: { http: 'https://wallaby.node.glif.io/rpc/v0' },
    },
    blockExplorers: {
    default: { name: 'Glif', url: 'https://explorer.glif.io/type/valuex/?network=wallabynet' },

    },
    testnet: true,
};


export const hyperspaceTestnet: Chain = {
    id: 3141,
    name: 'Filecoin HyperSpace Testnet',
    network: 'hyperspace testnet',
    nativeCurrency: {
    decimals: 18,
    name: 'Filecoin',
    symbol: 'tFIL',
    },
    rpcUrls: {
    default: { http: 'https://api.hyperspace.node.glif.io/rpc/v1' },
    },
    blockExplorers: {
    default: { name: 'Glif', url: 'https://explorer.glif.io/type/valuex/?network=hyperspacenet' },
    },
    testnet: true,
};
