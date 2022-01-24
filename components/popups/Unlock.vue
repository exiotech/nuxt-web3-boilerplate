<template>
  <popups-wrapper title="Connect to a wallet" name="unlock">
    <div slot-scope="popup">
      <button
        v-for="(provider, index) of providers"
        :key="index"
        type="button"
        class="card card-body w-100 mb-3"
        @click="handleConnect(index, popup.close)"
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
    </div>
  </popups-wrapper>
</template>

<script>
import { mapActions } from "vuex";
import { PROVIDERS } from "~/constants";

export default {
  name: "UnlockWallet",
  data() {
    return {
      selectedProviderIndex: null,
    };
  },

  computed: {
    providers() {
      return PROVIDERS.filter((provider) => {
        if (provider.isInstalled && !provider.isInstalled()) {
          return false;
        }
        return (
          provider.providerName !== 'injected' || window.ethereum?.[provider.indetifier]
        );
      });
    },
  },

  methods: {
    ...mapActions({
      login: 'auth/login',
    }),

    async handleConnect(index, callback) {
      this.selectedProviderIndex = index;
      console.log(this.providers);
      const { providerName } = this.providers[index];
      try {
        await this.$localForage.setItem('provider', providerName);
        await this.$setWeb3Provider(providerName);
        await this.login();
        this.selectedProviderIndex = null;
        callback();
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.provider-icon {
  height: 35px;
  width: 35px;
}
</style>
