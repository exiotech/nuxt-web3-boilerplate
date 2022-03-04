import BigNumber from "bignumber.js";

export const state = () => {
  return {
    decimals: {
      NATIVE: 18,
    },
  };
};

export const mutations = {
  SET_DECIMALS(state, decimals) {
    state.decimals = Object.assign({}, state.decimals, decimals);
  },
};

export const actions = {
  loadTokensDecimals({ commit }) {
    try {
      const decimals = {};
      const tokenNames = Object.keys(this.$contracts.tokens);

      tokenNames.forEach((tokenName) => {
        this.$addWeb3Query(
          `WEB3_LOAD_DECIMALS_${tokenName}`,
          this.$contracts.tokens[tokenName].methods.decimals(),
          (r) => {
            decimals[tokenName] = Number(r);
            commit("SET_DECIMALS", decimals);
          },
        );
      });
    } catch (error) {
      console.error(error);
    }
  },

  loadDecimals({ commit }, tokenName) {
    try {
      const decimals = {};
      if (tokenName !== "ETH") {
        decimals.ETH = 18;
      } else {
        this.$addWeb3Query(
          `WEB3_LOAD_DECIMALS_${tokenName}`,
          this.$contracts.tokens[tokenName].methods.decimals(),
          (r) => {
            decimals[tokenName] = Number(r);
            commit("SET_DECIMALS", decimals);
          },
        );
      }

      commit("SET_DECIMALS", decimals);
    } catch (error) {
      console.error(error);
    }
  },

  addToWallet(_, { symbol, image, decimals = 18 }) {
    const tokenAddress = this.$contracts.tokens[symbol].options.address;

    return new Promise((resolve, reject) => {
      this.$ethereum().sendAsync(
        {
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: tokenAddress,
              symbol,
              decimals,
              image,
            },
          },
        },
        (err, result) => (err ? reject(err.message) : resolve(result)),
      );
    });
  },
};

export const getters = {
  decimals: ({ decimals }) => (token = "NATIVE") => decimals[token] || 18,
  parseFloat: (_, { decimals }) => (token = "NATIVE", amount) =>
    new BigNumber(amount).div(
      new BigNumber(10).pow(new BigNumber(decimals(token))),
    ),
  parseUint: (_, { decimals }) => (token = "NATIVE", amount) =>
    new BigNumber(amount).times(
      new BigNumber(10).pow(new BigNumber(decimals(token))),
    ),
};
