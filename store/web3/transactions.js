export const state = () => {
	return {
		queries: {},
		transactions: {},
		queryTimeout: null,
	};
};

export const mutations = {
	ADD_QUERY(state, { id, query, callback, chainId }) {
		let target;
		let callData;
		let outputs;
		let secondaryOutputs;
		if (Array.isArray(query)) {
			const method = this.$contracts.multicall.methods.aggregate(query.map((q) => ({
				target: q._parent._address,
				callData: q.encodeABI(),
			})));
			target = this.$contracts.multicall.options.address;
			callData = method.encodeABI();
			outputs = method._method.outputs;
			secondaryOutputs = query.map((q) => q._method.outputs);
		} else {
			target = query._parent._address;
			callData = query.encodeABI();
			outputs = query._method.outputs;
		}
		if (!state.queries[chainId]) {
			state.queries[chainId] = {};
		}
		state.queries[chainId][id] = {
			target,
			callData,
			outputs,
			secondaryOutputs,
			callback,
		};
	},
	SET_TRANSACTION(state, { txhash, status, error, hash }) {
		state.transactions = {
			...state.transactions,
			[txhash]: {
				...state.transactions[txhash],
				hash,
				status,
				error,
			},
		};
	},
	SET_QUERY_TIMEOUT(state, timeout) {
		state.queryTimeout = timeout;
	},
	REMOVE_TRANSACTION(state, id) {
		delete state.transactions[id];
	},
};

export const actions = {
	send({ commit, rootState, dispatch }, { callback, ...options }) {
		const txhash = callback.encodeABI() + Date.now();
		commit('SET_TRANSACTION', { txhash, status: 'PENDING_SEND', error: null });
		return callback
			.send({
				from: rootState.auth.address,
				...options,
			})
			.on('transactionHash', (hash) => {
				commit('SET_TRANSACTION', { txhash, hash, status: 'PENDING_CONFIRMATION', error: null });
			})
			.then(() => {
				commit('SET_TRANSACTION', { txhash, status: 'CONFIRMED', error: null });
			})
			.catch((error) => {
				commit('SET_TRANSACTION', { txhash, status: 'ERROR', error });
				throw error;
			})
			.finally(() => {
				dispatch('query');
			});
	},
	query({ state, rootState: { web3: { chainId } } }) {
		const requests = Object.values(state.queries[chainId] || {});
		if (!requests.length) {
			return;
		}
		this.$multicall(requests).then((r) => {
			r.forEach((res, i) => {
				requests[i].callback(res);
			});
		});
	},
	async startQueryTimeout({ state, dispatch, commit }) {
		if (state.queryTimeout) {
			clearTimeout(state.queryTimeout);
		}
		await dispatch('query');
		const timeout = setTimeout(() => {
			dispatch('startQueryTimeout');
		}, 5 * 1000);

		commit('SET_QUERY_TIMEOUT', timeout);
	},
};

export const getters = {
	all: ({ transactions }) => transactions,
};
