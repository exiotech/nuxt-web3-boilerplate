import BigNumber from "bignumber.js";
import deepmerge from "deepmerge";

import { MAX_UINT } from "@/constants/web3";

export const state = () => {
  return {
    balances: {
      NATIVE: new BigNumber("0"),
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
};

function loadTokenBalances(address, tokenNames) {
  const data = tokenNames.map((tokenName) => {
    return this.$contracts.tokens[tokenName].methods.balanceOf(address);
  });
  return this.$multicall(data);
}

export const actions = {
  async loadBalances({ rootState, commit, dispatch }) {
    try {
      const { address } = rootState.auth;
      const balances = {};
      const tokenNames = Object.keys(this.$contracts.tokens).filter((token) => {
        return !!this.$contracts.tokens[token].options.address;
      });
      console.log(tokenNames);
      await dispatch("web3/assets/loadTokensDecimals", {}, { root: true });
      (await loadTokenBalances.bind(this)(address, tokenNames)).forEach((r, i) => {
        balances[tokenNames[i]] = r;
      });

      balances.NATIVE = await this.$web3()
        .eth.getBalance(address)
        .catch((e) => {
          console.error(e);
          return 0;
        });

      commit("SET_BALANCES", balances);
    } catch (error) {
      console.error(error);
    }
  },

  async loadBalance({ rootState, commit }, tokenName) {
    try {
      const { address } = rootState.auth;
      const balances = {};
      if (tokenName !== "NATIVE") {
        balances.NATIVE = await this.$web3()
          .eth.getBalance(address)
          .then((r) => Math.max(Number(this.$web3().utils.fromWei(r)) - 0.01, 0))
          .catch((e) => {
            console.error(e);
            return 0;
          });
      } else {
        balances[tokenName] = await this.$contracts.tokens[tokenName].methods
          .balanceOf(address)
          .call();
      }

      commit("SET_BALANCES", balances);
    } catch (error) {
      console.error(error);
    }
  },

  async loadAllowance({ rootState, commit }, { token, spender }) {
    try {
      const { address } = rootState.auth;
      const contract = this.$contracts.tokens[token];
      const allowance = await this.$multicall([contract.methods.allowance(address, spender)]).then((r) => r[0]);
      commit("SET_ALLOWANCE", { token, spender, allowance });
    } catch (error) {
      console.error("Error loading allowance for", token, spender);
      console.error(error);
    }
  },

  send({ dispatch, rootGetters }, { token, receiver, amount }) {
    const contract = this.$contracts.tokens[token];
    amount = rootGetters["web3/assets/parseUint"](token, amount);
    return dispatch(
      "transactions/send",
      {
        callback: contract.methods.transfer(receiver, amount),
      },
      { root: true },
    ).then(() => {
      return dispatch("loadBalance", token);
    });
  },

  approve({ dispatch, rootGetters }, { token, spender, amount = MAX_UINT }) {
    if (amount !== MAX_UINT) {
      amount = rootGetters["web3/assets/parseUint"](token, amount);
    }
    return dispatch(
      "transactions/send",
      {
        callback: this.$contracts.tokens[token].methods.approve(spender, amount),
      },
      { root: true },
    ).then(() => {
      return dispatch("loadAllowance", { token, spender });
    });
  },
};

export const getters = {
  balanceOf:
    (...[{ balances }, , , { "web3/assets/parseFloat": parseFloat }]) =>
    (token, uint = false) => {
      if (["ETH", "BNB", "MATIC"].includes(token)) {
        token = "NATIVE";
      }
      const b = balances[token] || 0;
      return uint ? b : parseFloat(token, b);
    },
  allowance:
    (...[{ allowances }, , , { "web3/assets/parseFloat": parseFloat }]) =>
    (token, spender, uint) => {
      if (["ETH", "BNB", "MATIC", "NATIVE"].includes(token)) {
        return new BigNumber(MAX_UINT);
      }
      const b = allowances[token]?.[spender] || new BigNumber(0);
      return uint ? b : parseFloat(token, b);
    },
};
