export const state = () => {
  return {
    address: "",
    isLoggedIn: false,
    isConnected: false,
  };
};

export const actions = {
  async login({ commit }) {
    let addresses = [];
    if (this.$ethereum()) {
      if (this.$ethereum().enable) {
        addresses = await this.$ethereum().enable();
      } else if (this.$ethereum().request) {
        addresses = await this.$ethereum().request({
          method: "eth_requestAccounts",
        });
      } else if (this.$web3().requestAccounts) {
        addresses = await this.$web3().requestAccounts();
      }
      if (this.$ethereum().on) {
        this.$ethereum().on("accountsChanged", (accounts) => {
          const address = accounts[0];
          commit("LOGIN", { address });
        });
      }
      if (this.$web3()) {
        if (!addresses.length) {
          addresses = await this.$web3().eth.getAccounts();
        }
        const address = this.$ethereum()?.selectedAddress || addresses[0];
        if (!address) {
          throw new Error("NO_WEB3");
        }
        commit("LOGIN", { address });
        return { address };
      }
    }
    return null;
  },
};

export const mutations = {
  LOGIN(state, { address }) {
    address = this.$web3().utils.toChecksumAddress(address);
    if (address === state.address) {
      return;
    }
    state.address = address || "";
    state.isLoggedIn = true;
  },
  LOGOUT(state) {
    state.address = null;
    state.isLoggedIn = false;
  },
  SET_CONNECTED(state, isConnected = true) {
    state.isConnected = isConnected;
  },
};

export const getters = {
  address: ({ address }) => address,
  isLoggedIn: ({ isLoggedIn }) => isLoggedIn,
  isConnected: ({ isConnected }) => isConnected,
};
