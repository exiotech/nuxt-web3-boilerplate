import BigNumber from 'bignumber.js';
import deepmerge from 'deepmerge';

import { MAX_UINT } from '@/constants/web3';

export const state = () => {
  return {
    balances: {
      NATIVE: new BigNumber('0'),
    },
    allowances: {},
  };
};

export const mutations = {
  SET_BALANCES(state, balances) {
    state.balances = Object.assign({}, state.balances, balances);
  },
  SET_ALLOWANCE(state, { token, spender, allowance }) {
    state.allowances = deepmerge(state.allowances, { [token]: { [spender]: allowance } });
  },
  RESET(state) {
    state.allowances = {};
    state.balances = {
      NATIVE: new BigNumber('0'),
    };
  },
};

export const actions = {
  loadBalances({ rootState, commit, dispatch }) {
    try {
      const { address } = rootState.auth;
      const balances = {};
      const tokenNames = Object.keys(this.$contracts.tokens).filter((token) => {
        return !!this.$contracts.tokens[token].options.address;
      });
      dispatch('web3/assets/loadTokensDecimals', {}, { root: true });

      this.$addWeb3Query(
        `ASSETS_LOAD_BALANCE_NATIVE`,
        this.$contracts.multicall.methods.getEthBalance(address),
        (r) => {
          balances.NATIVE = r;
          commit('SET_BALANCES', balances);
        },
      );

      tokenNames.forEach((tokenName) => {
        this.$addWeb3Query(
          `ASSETS_LOAD_BALANCE_${tokenName}`,
          this.$contracts.tokens[tokenName].methods.balanceOf(address),
          (r) => {
            balances[tokenName] = r;
            commit('SET_BALANCES', balances);
          },
        );
      });

      commit('SET_BALANCES', balances);
    } catch (error) {
      console.error(error);
    }
  },

  loadBalance({ rootState, commit }, tokenName) {
    try {
      const { address } = rootState.auth;
      const balances = {};
      if (tokenName === 'NATIVE') {
        this.$addWeb3Query(
          `ASSETS_LOAD_BALANCE_${tokenName}`,
          this.$contracts.multicall.methods.getEthBalance(address),
          (r) => {
            balances[tokenName] = r;
            commit('SET_BALANCES', balances);
          },
        );
      } else {
        this.$addWeb3Query(
          `ASSETS_LOAD_BALANCE_${tokenName}`,
          this.$contracts.tokens[tokenName].methods.balanceOf(address),
          (r) => {
            balances[tokenName] = r;
            commit('SET_BALANCES', balances);
          },
        );
      }
    } catch (error) {
      console.error(error);
    }
  },

  loadAllowance({ rootState, commit }, { token, spender }) {
    try {
      const { address } = rootState.auth;

      this.$addWeb3Query(
        `ASSETS_LOAD_ALLOWANCE_${token}_${spender}`,
        this.$contracts.tokens[token].methods.allowance(address, spender),
        (allowance) => {
          commit('SET_ALLOWANCE', { token, spender, allowance });
        },
      );
    } catch (error) {
      console.error('Error loading allowance for', token, spender);
      console.error(error);
    }
  },

  send({ rootGetters }, { token, receiver, amount }) {
    const contract = this.$contracts.tokens[token];
    amount = rootGetters['web3/assets/parseUint'](token, amount);
    return this.$sendWeb3Transaction(contract.methods.transfer(receiver, amount));
  },

  approve({ rootGetters }, { token, spender, amount = MAX_UINT }) {
    if (amount !== MAX_UINT) {
      amount = rootGetters['web3/assets/parseUint'](token, amount);
    }
    return this.$sendWeb3Transaction(this.$contracts.tokens[token].methods.approve(spender, amount));
  },
};

export const getters = {
  balanceOf: (...[{ balances }, , , { 'web3/assets/parseFloat': parseFloat }]) => (
    token,
    uint = false,
  ) => {
    if (['ETH', 'BNB', 'MATIC'].includes(token)) {
      token = 'NATIVE';
    }
    const b = balances[token] || 0;
    return uint ? b : parseFloat(token, b);
  },
  allowance: (...[{ allowances }, , , { 'web3/assets/parseFloat': parseFloat }]) => (
    token,
    spender,
    uint,
  ) => {
    if (['ETH', 'BNB', 'MATIC', 'NATIVE'].includes(token)) {
      return new BigNumber(MAX_UINT);
    }
    const b = allowances[token]?.[spender] || new BigNumber(0);
    return uint ? b : parseFloat(token, b);
  },
};
