<template>
  <form @submit.prevent="handleSubmit">
    <slot />
  </form>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    callback: {
      type: Function,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      transactions: "web3/transactions/all",
    }),
  },
  methods: {
    async handleSubmit() {
      try {
        this.$nuxt.$emit("popups.transaction.open");
        await this.callback();
      } catch (e) {
        console.error(e);
        this.$nuxt.$emit("popups.transaction.error", e);
      }
    },
  },
};
</script>
