<template>
  <web3-connection-placeholder :classes="['page-content']" tag="main">
    <div class="container">
      <div class="card card-body mx-auto mt-5 form-container">
        <web3-form :callback="onSend">
          <fieldset class="mb-3">
            <label for="">Token:</label>
            <select
              v-model="selectedToken"
              class="form-control"
              type="text"
              placeholder="Receiver Address"
            >
              <option v-for="token in tokenNames" :key="token" :value="token">
                {{ token }}
              </option>
            </select>
          </fieldset>
          <fieldset class="mb-3">
            <label for="">Send To:</label>
            <input
              v-model="receiver"
              class="form-control"
              type="text"
              placeholder="Receiver Address"
            />
          </fieldset>
          <fieldset class="mb-3">
            <label for=""
              >Amount ({{ selectedToken && balanceOf(selectedToken) }}):</label
            >
            <input
              v-model="amount"
              class="form-control"
              type="text"
              placeholder="Send Amount"
            />
          </fieldset>
          <button class="btn btn-success w-100" type="submit" :disabled="!selectedToken">
            Send
          </button>
        </web3-form>
      </div>
    </div>
    <div
      slot="connect"
      class="d-flex h-100 w-100 align-self-center justify-content-center"
    >
      <div class="text-center">
        <p>Please, connect your wallet to use the app</p>
        <button class="btn btn-primary btn-lg" @click="$nuxt.$emit('popups.unlock.open')">
          Connect
        </button>
      </div>
    </div>
  </web3-connection-placeholder>
</template>

<script>
import { mapActions } from "vuex";
import user from "@/mixins/user";

export default {
  mixins: [user],
  data() {
    return {
      receiver: "0xa42b810Cf515Fc8E472CCE60f3F136e81E1e816C",
      amount: "0",
      selectedToken: null,
    };
  },
  computed: {
    tokenNames() {
      return Object.keys(this.$contracts?.tokens || {}).filter((token) => {
        return !!this.$contracts.tokens[token].options.address;
      });
    },
  },
  watch: {
    tokenNames(to) {
      if (to[0]) {
        this.selectedToken = to[0];
      }
    },
  },
  methods: {
    ...mapActions({
      send: "user/assets/send",
    }),
    onSend() {
      return this.send({
        token: this.selectedToken,
        receiver: this.receiver,
        amount: this.amount,
      });
    },
  },
};
</script>

<style lang="scss">
.form-container {
  max-width: 400px;
}
</style>