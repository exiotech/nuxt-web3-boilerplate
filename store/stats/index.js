export const state = () => {
    return {
    };
  };
  
  export const mutations = {
    SET_DATA(state, data) {
    },
    RESET(state) {
      // Bring all state to initial
    },
  };
  
  export const actions = {
    loadData({ commit }) {
      try {
  
        commit("SET_DATA", {});
      } catch (error) {
        console.error(error);
      }
    },
  };
  
  export const getters = {
  };
  