
export const state = () => {
  return {
  };
};

export const mutations = {
  SET_DATA(state, data) {
    for (const key in data) {
      state[key] = data[key];
    }
  },
};

export const actions = {
  async loadData({ rootState, commit, dispatch }) {
    try {
      const { address } = rootState.auth;
      console.log(address);

    //   const {
    //   } = await this.$multicall([
    //  ]).then((r) => {
    //     return {
    //     };
    //   });

      await dispatch("assets/loadBalances");

      commit("SET_DATA", {
      });
    } catch (error) {
      console.error(error);
    }
  },
};

export const getters = {
};
