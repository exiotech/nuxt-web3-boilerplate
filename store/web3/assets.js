import BigNumber from "bignumber.js";

export const state = () => {
  return {
    decimals: {
      ETH: 18,
    },
  };
};

export const mutations = {
  SET_DECIMALS(state, decimals) {
    state.decimals = Object.assign({}, state.decimals, decimals);
  },
};

function loadDecimals() {
  const tokenNames = Object.keys(this.$contracts.tokens).filter((token) => {
    return !!this.$contracts.tokens[token].options.address;
  });
  const data = tokenNames.map((tokenName) => {
    return this.$contracts.tokens[tokenName].methods.decimals();
  });
  return this.$multicall(data);
}

export const actions = {
  async loadTokensDecimals({ commit }) {
    try {
      const decimals = {};
      const tokenNames = Object.keys(this.$contracts.tokens);
      (await loadDecimals.bind(this)()).forEach((r, i) => {
        decimals[tokenNames[i]] = Number(r);
      });

      commit("SET_DECIMALS", decimals);
    } catch (error) {
      console.error(error);
    }
  },

  async loadDecimals({ rootState, commit }, tokenName) {
    try {
      const { address } = rootState.auth;
      const decimals = {};
      if (tokenName !== "ETH") {
        decimals.ETH = 18;
      } else {
        decimals[tokenName] = await this.$contracts.tokens[tokenName].methods
          .balanceOf(address)
          .call();
      }

      commit("SET_DECIMALS", decimals);
    } catch (error) {
      console.error(error);
    }
  },
};

export const getters = {
  decimals:
    ({ decimals }) =>
    (token) =>
      decimals[token] || 18,
  parseFloat:
    ({ decimals }) =>
    (token, amount) =>
      new BigNumber(amount)
        .div(new BigNumber(10).pow(new BigNumber(decimals[token] || 18)))
        .toString(),
  parseUint:
    ({ decimals }) =>
    (token, amount) =>
      new BigNumber(amount)
        .times(new BigNumber(10).pow(new BigNumber(decimals[token] || 18)))
        .toString(),
};
