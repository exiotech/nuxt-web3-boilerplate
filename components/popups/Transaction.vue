<template>
  <div class="modal" :class="{ show }">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content mx-auto">
        <div class="modal-body text-center">
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
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { mapGetters } from "vuex";
import PopupsBase from "./_Base";

export default {
  extends: PopupsBase,
  data() {
    return {
      txhash: null,
      error: null,
    };
  },
  computed: {
    ...mapGetters({
      transactions: "transactions/all",
    }),
    isConfirmed() {
      return this.txhash && this.transactions[this.txhash]?.status === "CONFIRMED";
    },
    text() {
      if (this.error) {
        return "Something went wrong.";
      }
      return this.isConfirmed
        ? "Transaction sucessfully confirmed!"
        : this.txhash
        ? "Waiting for the transaction to confim..."
        : "Please confirm the popped-up transaction.";
    },
    title() {
      if (this.error) {
        return "Transaction failed";
      }

      return this.isConfirmed
        ? "Transaction confirmed!"
        : this.txhash
        ? "Please wait"
        : "Confirm Transaction";
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
  },
  mounted() {
    this.registerEvent("error", (e) => {
      console.error(e);
      this.error = e;
      this.show = true;
    });
  },
  methods: {
    close() {
      this.error = null;
      this.txhash = null;
      this.show = false;
    },
  },
};
</script>
