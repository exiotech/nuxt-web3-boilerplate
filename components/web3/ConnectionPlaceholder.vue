<template>
  <component :is="tag" :class="classes">
    <slot v-if="address" :address="address" />
    <slot v-else-if="$slots.connect" name="connect" />
    <button
      v-else
      class="btn btn-primary"
      @click="$nuxt.$emit('popups.unlockwallet.open')"
    >
      Connect
    </button>
  </component>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    classes: {
      type: [Array, String, Object],
      default: () => [],
    },
    tag: {
      type: String,
      default: "div",
    },
  },
  computed: {
    ...mapGetters({
      address: "auth/address",
    }),
  },
};
</script>
