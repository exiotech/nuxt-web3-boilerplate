<template>
  <popups-wrapper
    title="Connect to a wallet"
    name="unlock"
    :show="show"
    @close="close"
  >
    <button
      v-for="(provider, index) of providers"
      :key="index"
      type="button"
      class="card card-body w-100 mb-3"
      @click="handleConnect(index)"
    >
      <div class="row no-gutters align-items-center">
        <div class="col">
          <p class="mb-0 fw-bold">
            {{ provider.name }}
          </p>
        </div>
        <div class="col-auto">
          <img
            :src="provider.logo"
            :alt="provider.name"
            class="provider-icon bg-white rounded-circle"
          />
        </div>
      </div>
    </button>
  </popups-wrapper>
</template>

<script setup>
const { $setWeb3Provider, $store, $localForage } = useNuxtApp();

let selectedProviderIndex = null;

async function handleConnect(index) {
  selectedProviderIndex = index;
  const { providerName } = this.providers[index];
  try {
    await $localForage.setItem("provider", providerName);
    await $setWeb3Provider(providerName);
    await $store.dispatch("auth/login");
    selectedProviderIndex = null;
    this.close();
  } catch (err) {
    console.error(err);
  }
}
</script>

<script>
import { mapActions } from "vuex";
import PopupsBase from "./_Base";
import { PROVIDERS } from "~/constants";

export default {
  name: "UnlockWallet",
  extends: PopupsBase,

  computed: {
    providers() {
      return PROVIDERS.filter((provider) => {
        if (provider.isInstalled && !provider.isInstalled()) {
          return false;
        }
        return (
          provider.providerName !== "injected" ||
          window.ethereum?.[provider.indetifier]
        );
      });
    },
  },

  methods: {
    ...mapActions({
      login: "auth/login",
    }),
  },
};
</script>

<style lang="scss" scoped>
.provider-icon {
  height: 35px;
  width: 35px;
}
</style>
