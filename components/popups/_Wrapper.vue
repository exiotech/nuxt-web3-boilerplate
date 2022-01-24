<template>
  <div class="modal" :class="{ show }" @click.self="closable && close">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content mx-auto">
        <div v-if="title" class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" @click="close" />
        </div>
        <div class="modal-body">
          <slot :close="close" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PopupsBase from "./_Base";

export default {
  extends: PopupsBase,
  props: {
    closable: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
  },
};
</script>
