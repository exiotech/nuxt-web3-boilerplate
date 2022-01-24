<template>
  <form @submit.prevent="submit">
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
      transactions: "transactions/all",
    }),
  },
  methods: {
    async submit() {
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
