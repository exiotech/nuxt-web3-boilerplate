<template>
  <div class="modal" :class="{ show }" @click.self="closable && close">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content mx-auto">
        <div class="modal-header">
          <h5 class="modal-title">Unsupported Network</h5>
        </div>
        <div v-if="switching" class="modal-body">Loading...</div>
        <div v-else class="modal-body">
          Your current network ({{ currentNetworkName }}) is not supported<br />
          Please switch to one of the supported networks:<br />
          <button
            v-for="network in supportedNetworks"
            :key="network.chainId"
            class="btn btn-link"
            type="button"
            @click="onSwitchChain(network.chainId)"
          >
            {{ network.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import PopupsBase from "./_Base";

import { NETWORKS } from "~/constants/networks";

export default {
  name: "UnsupportedNetwork",
  extends: PopupsBase,
  data() {
    return {
      switching: false,
    };
  },
  computed: {
    ...mapGetters({
      chainId: "web3/chainId",
      supportedNetworks: "web3/supportedNetworks",
      isSupportedChain: "web3/isSupportedChain",
    }),
    currentNetworkName() {
      return (
        Object.values(NETWORKS).filter(({ chainId }) => chainId === this.chainId)[0]
          ?.name || "Unknown network"
      );
    },
  },
  watch: {
    chainId(to, from) {
      console.log(to, from);
      if (!this.isSupportedChain) {
        this.open();
      } else {
        this.close();
      }
    },
  },
  methods: {
    ...mapActions({
      switchChain: "web3/switchChain",
    }),
    async onSwitchChain(chainId) {
      try {
        this.switching = true;
        await this.switchChain(chainId);
        this.close();
      } catch (e) {
        console.error(e);
      } finally {
        this.switching = false;
      }
    },
  },
};
</script>
