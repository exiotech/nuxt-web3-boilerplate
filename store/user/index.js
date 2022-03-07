export const state = () => {
	return {
	};
};

export const mutations = {
	SET_DATA(state, data) {
	},
	RESET(state) {
		// Bring all user state to initial
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
