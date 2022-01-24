import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Fortmatic from 'fortmatic';
import BigNumber from 'bignumber.js';

import CONTRACTS from '@/contracts/addresses';
import { getChainById } from '@/constants/networks';

import ERC20_ABI from '@/contracts/abis/ERC20';

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  let provider = null;
  let chainID = 3;
  const web3obj = new Web3(getChainById(chainID).url);
  const readWeb3Provider = new Web3.providers.WebsocketProvider(
    getChainById(chainID).wss,
    {
      reconnect: {
        auto: true,
        delay: 1000, // ms
        maxAttempts: 5,
        onTimeout: false,
      },
    },
  );
  const web3Read = new Web3(readWeb3Provider);

  const $contracts = {
    tokens: {},
    strategies: [],
  };

  const $multicall = (data) => {
    return $contracts.multicall.methods
      .aggregate(
        data.map((d) => ({
          target: d._parent._address,
          callData: d.encodeABI(),
        })),
      )
      .call()
      .then(({ returnData }) =>
        returnData.map((d, i) => {
          const types = data[i]._method.outputs;
          const r = web3obj.eth.abi.decodeParameters(
            types.map(({ type }) => type),
            d,
          );
          if (types.length === 1) {
            return r[0];
          }
          const resultObject = {};
          types.forEach(({ name }, index) => {
            resultObject[name] = r[index];
          });
          return resultObject;
        }),
      );
  };

  const setChainId = (id) => {
    if (chainID !== id) {
      nuxtApp.nuxt2Context.app.store.commit('web3/SET_LOADING', true);
    }
    chainID = id;
    const provider = new Web3.providers.WebsocketProvider(
      getChainById(chainID).wss,
      {
        reconnect: {
          auto: true,
          delay: 1000, // ms
          maxAttempts: 5,
          onTimeout: false,
        },
      },
    );
    web3Read.setProvider(provider);

    try {
      Object.keys(CONTRACTS).forEach((contractName) => {
        // if (!CONTRACTS[contractName][chainID]) {
        //   throw new Error(`Missing address for ${contractName} on ${chainId}`);
        // }
        if (contractName.toUpperCase().includes('TOKEN')) {
          $contracts.tokens[contractName.toUpperCase().replace('TOKEN', '')]._address =
            CONTRACTS[contractName][chainID];
        } else {
          $contracts[contractName[0].toLowerCase() + contractName.slice(1)]._address =
            CONTRACTS[contractName][chainID];
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      nuxtApp.nuxt2Context.app.store.commit('web3/SET_CHAIN_ID', chainID);
      nuxtApp.nuxt2Context.app.store.commit('web3/SET_LOADING', false);
    }
  };

  Object.keys(CONTRACTS).forEach((contractName) => {
    let ABI;
    const contractNameUppercase = `${contractName[0].toUpperCase()}${contractName.slice(
      1,
    )}`;
    if (contractName.toUpperCase().includes('TOKEN')) {
      try {
        ABI = require(`@/contracts/abis/${contractNameUppercase}.json`);
      } catch (e) {
        ABI = ERC20_ABI;
      }
      $contracts.tokens[contractName.toUpperCase().replace('TOKEN', '')] =
        new web3obj.eth.Contract(ABI, CONTRACTS[contractName][chainID]);
    } else {
      ABI = require(`@/contracts/abis/${contractNameUppercase}.json`);
      if (['Multicall'].includes(contractNameUppercase)) {
        $contracts[contractName[0].toLocaleLowerCase() + contractName.slice(1)] =
          new web3Read.eth.Contract(ABI, CONTRACTS[contractName][chainID]);
      } else {
        $contracts[contractName[0].toLocaleLowerCase() + contractName.slice(1)] =
          new web3obj.eth.Contract(ABI, CONTRACTS[contractName][chainID]);
      }
    }
  });

  setChainId(chainID);

  const interval = setInterval(async () => {
    try {
      provider = await detectEthereumProvider(1000);
      if (provider) {
        web3obj.setProvider(provider);
        clearInterval(interval);
      }
    } catch (e) {
      // console.error(e);
    }
  }, 1500);

  const setWeb3Provider = async (p) => {
    let providerObject;
    switch (p) {
      case 'injected':
        providerObject = window.ethereum;
        break;
      case 'walletconnect':
        providerObject = new WalletConnectProvider({
          chainId: 56,
          network: 'binance',
          rpc: {
            56: getChainById(chainID).url,
          },
        });
        break;
      case 'fortmatic': {
        const fm = new Fortmatic(process.env.FORTMATIC_KEY);
        providerObject = fm.getProvider();
        break;
      }
      case 'binance': {
        providerObject = window.BinanceChain;
        break;
      }
    }
    await providerObject.enable();
    web3obj.setProvider(providerObject);
    provider = providerObject;
    setChainId(await web3obj.eth.getChainId());
    provider.on('chainChanged', (id) => {
      setChainId(parseInt(id));
    });
  };

  const chainId = () => {
    return chainID;
  };

  const $bigNumber = (n) => {
    return new BigNumber(n);
  };

  nuxtApp.provide('ethereum', () => provider);
  nuxtApp.provide('setWeb3Provider', setWeb3Provider);
  nuxtApp.provide('web3', web3obj);
  nuxtApp.provide('web3Read', web3Read);
  nuxtApp.provide('contracts', $contracts);
  nuxtApp.provide('multicall', $multicall);
  nuxtApp.provide('bigNumber', $bigNumber);
  nuxtApp.provide('chainId', chainId);
});
