<template>
  <div class="modal" :class="{ show }" @click.self="closable && $emit('close')">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content mx-auto">
        <div v-if="title" class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')" />
        </div>
        <div class="modal-body">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
		show: {
			type: Boolean,
			default: false,
		},
	},
};
</script>

<style lang="scss" scoped>
.modal {
  background-color: rgba(255, 255, 255, 0.6);
  overflow: hidden;
  height: 0;
  width: 0;
  display: block;
  opacity: 0;

  &-content {
    opacity: 0;
    transform: scale(0.5);
  }

  .btn-close {
    position: absolute;
    right: 28px;
    top: 35px;
    padding: 0;
  }

  &.show {
    height: 100%;
    width: 100%;
    opacity: 1;
    transition: opacity 0.2s;

    .modal-content {
      opacity: 1;
      transform: scale(1);
      transition: transform 0.4s, opacity 0.5s;
    }
  }
}
</style>