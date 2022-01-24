import metamask from "@/assets/images/wallets/metamask.svg";
import trust from "@/assets/images/wallets/trust.svg";
import math from "@/assets/images/wallets/math.svg";
import binance from "@/assets/images/wallets/binance-chain.svg";
import wallet from "@/assets/images/wallets/wallet.svg";

const PROVIDERS = [
  {
    logo: metamask,
    name: "Metamask",
    providerName: "injected",
    supportedChains: true,
    indetifier: 'isMetaMask',
    web3ObjectName: () => !!window.ethereum,
  },
  {
    logo: trust,
    name: "Trust Wallet",
    providerName: "injected",
    supportedChains: true,
    web3ObjectName: () => !!window.ethereum,
  },
  {
    logo: math,
    name: "Math Wallet",
    providerName: "injected",
    supportedChains: true,
    indetifier: "isMathWallet",
    web3ObjectName: () => !!window.ethereum,
  },
  {
    logo: binance,
    name: "Binance Chain Wallet",
    providerName: "binance",
    supportedChains: [56, 97],
    web3ObjectName: () => !!window.BinanceChain,
  },
  {
    logo: wallet,
    name: "Wallet Connect",
    providerName: "walletconnect",
    supportedChains: true,
    isInstalled: () => true,
  },
];

export default PROVIDERS;
