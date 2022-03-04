export const NETWORKS = {
  mainnet: {
    name: 'Ethereum Mainnet',
    url: `https://mainnet.infura.io/v3/26865e576832400484856124fe33ad87`,
    wss: 'wss://mainnet.infura.io/ws/v3/26865e576832400484856124fe33ad87',
    chainId: 1,
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: 'https://etherscan.com',
  },
  ropsten: {
    name: 'Ropsten Testnet',
    url: `https://ropsten.infura.io/v3/26865e576832400484856124fe33ad87`,
    wss: 'wss://ropsten.infura.io/ws/v3/26865e576832400484856124fe33ad87',
    chainId: 3,
    nativeCurrency: {
      name: 'Ropsten Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: 'https://ropsten.etherscan.com',
  },
  rinkeby: {
    name: 'Rinkeby Testnet',
    url: `https://rinkeby.infura.io/v3/26865e576832400484856124fe33ad87`,
    wss: 'wss://rinkeby.infura.io/ws/v3/26865e576832400484856124fe33ad87',
    chainId: 4,
    nativeCurrency: {
      name: 'Rinkeby Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: 'https://rinkeby.etherscan.com',
  },
  goerli: {
    name: 'Goerli Testnet',
    url: `https://api.exio.dev/5/proxy`,
    chainId: 5,
    nativeCurrency: {
      name: 'Goerli Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: 'https://goerli.etherscan.com',
  },
  kovan: {
    name: 'Kovan Testnet',
    url: `https://api.exio.dev/42/proxy`,
    chainId: 42,
    nativeCurrency: {
      name: 'Kovan Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: 'https://kovan.etherscan.com',
  },
  bsc: {
    name: 'Smart Chain',
    url: 'https://speedy-nodes-nyc.moralis.io/044b7388fd9a572b26882581/bsc/mainnet',
    wss: 'wss://speedy-nodes-nyc.moralis.io/044b7388fd9a572b26882581/bsc/mainnet/ws',
    chainId: 56,
    nativeCurrency: {
      name: 'Binance Coin',
      symbol: 'BNB',
      decimals: 18,
    },
    blockExplorerUrl: 'https://bscscan.com',
  },
  'bsc-testnet': {
    name: 'Smart Chain Testnet',
    url: 'https://api.exio.dev/97/proxy',
    chainId: 97,
    nativeCurrency: {
      name: 'Testnet Binance Coin',
      symbol: 'tBNB',
      decimals: 18,
    },
    blockExplorerUrl: 'https://testnet.bscscan.com',
  },
  xdai: {
    name: 'XDAI',
    url: 'https://rpc.xdaichain.com',
    chainId: 100,
  },
  etherlite: {
    name: 'Etherlite Mainnet',
    url: 'https://rpc.etherlite.org',
    chainId: 111,
    nativeCurrency: {
      name: 'ETL',
      symbol: 'ETL',
      decimals: 18,
    },
    blockExplorerUrl: 'https://explorer.etherlite.org',
  },
  heco: {
    name: 'Hecochain',
    url: 'https://http-mainnet.hecochain.com',
    chainId: 128,
  },
  matic: {
    name: 'Polygon (MATIC)',
    url: 'https://rpc-mainnet.maticvigil.com',
    chainId: 137,
  },
  fantom: {
    name: 'Fantom',
    url: 'https://rpcapi.fantom.network',
    chainId: 250,
  },
  'heco-testnet': {
    name: 'Hecochain Testnet',
    url: 'https://http-testnet.hecochain.com',
    chainId: 256,
  },
  moonbase: {
    name: 'Moonbase',
    url: 'https://rpc.testnet.moonbeam.network',
    chainId: 1287,
  },
  'fantom-testnet': {
    url: 'https://rpc.testnet.fantom.network',
    chainId: 4002,
  },
  mumbai: {
    url: 'https://rpc-mumbai.maticvigil.com/',
    chainId: 80001,
  },
  avalanche: {
    name: 'Avalanche',
    url: 'https://api.avax.network/ext/bc/C/rpc',
    chainId: 43114,
  },
  fuji: {
    url: 'https://api.avax-test.network/ext/bc/C/rpc',
    chainId: 43113,
  },
  harmony: {
    url: 'https://api.s0.t.hmny.io',
    chainId: 1666600000,
  },
  'harmony-testnet': {
    url: 'https://api.s0.b.hmny.io',
    chainId: 1666700000,
  },
};

export function getChainById(id) {
  return Object.values(NETWORKS).filter(
    ({ chainId }) => Number(chainId) === Number(id),
  )[0];
}
