<template>
  <popups-wrapper name="transaction" :show="show" @close="close">
    <p>{{ text }}</p>
    <button
      v-if="isConfirmed || error"
      class="btn btn-primary w-100"
      @click="close"
    >
      Ok
    </button>
    <div v-else-if="txhash" class="row">
      <div class="col">
        <a
          class="btn btn-link w-100"
          :href="`https://rinkeby.etherscan.io/tx/${txhash}`"
          target="_blank"
        >
          View on Explorer
        </a>
      </div>
      <div class="col">
        <button class="btn btn-primary w-100" @click="close">Close</button>
      </div>
    </div>
  </popups-wrapper>
</template>



<script>
import { mapGetters, mapMutations } from 'vuex';
import PopupsBase from './_Base';

export default {
	extends: PopupsBase,

	data() {
		return {
			name: 'transaction',
			txhash: null,
		};
	},

	computed: {
		...mapGetters({
			transactions: 'web3/transactions/all',
		}),
		isConfirmed() {
			return !!this.txhash && this.transactions[this.txhash]?.status === 'CONFIRMED';
		},
		error() {
			return this.transactions[this.txhash]?.error;
		},
		text() {
			switch (this.transactions[this.txhash]?.status) {
			case 'ERROR':
				return 'Transaction cancelled or failed, please try again';
			case 'CONFIRMED':
				return 'Transaction successfully confirmed';
			case 'PENDING_CONFIRMATION':
				return 'Waiting for transaction confirm';
			default:
				return 'Please confirm transaction';
			}
		},
		title() {
			switch (this.transactions[this.txhash]?.status) {
			case 'ERROR':
				return 'Transaction Failed';
			case 'CONFIRMED':
				return 'Transaction Confirmed';
			case 'PENDING_CONFIRMATION':
				return 'Please Wait';
			default:
				return 'Confirm Transaction';
			}
		},
	},
	watch: {
		transactions(to, from) {
			const tos = Object.keys(to);
			const froms = Object.keys(from);
			const newTxHash = tos.filter((x) => !froms.includes(x))[0];
			if (newTxHash) {
				this.txhash = newTxHash;
				this.show = true;
			}
		},
		isConfirmed(to, from) {
			if (from === false) {
				this.show = true;
				setTimeout(() => {
					this.close();
				}, 2000);
			}
		},
	},
	methods: {
		...mapMutations({
			removeTx: 'web3/transactions/REMOVE_TRANSACTION',
		}),
		close() {
			this.show = false;
			if (this.error || this.isConfirmed) {
				this.removeTx(this.txhash);
			}
			this.txhash = null;
		},
	},
};
</script>
