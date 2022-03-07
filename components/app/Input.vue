<template>
  <fieldset :disabled="disabled">
    <label
      v-if="$slots['label-left'] || $slots['label-right']"
      :for="id"
      class="d-flex mb-0 form-label"
      :class="labelClass"
    >
      <slot name="label-left" />
      <slot name="label-right" />
    </label>

    <div class="input-group" :class="groupClass">
      <slot name="prepend" />
      <input
        :id="id"
        autocomplete="off"
        :value="inputValue"
        :required="required"
        :placeholder="placeholder"
        :class="inputClass"
        type="text"
        pattern="^-?\d*\.?\d*$"
        class="form-control"
        @input="onInput"
      />

      <button
        v-if="max && showMaxBtn"
        type="button"
        class="btn btn-link text-uppercase"
        :disabled="max.isEqualTo(0) || (!!value && max.isEqualTo(value))"
        @click="$emit('input', max)"
      >
        Max
      </button>

      <button
        v-if="!showMaxBtn"
        class="btn btn-balance p w-max-content cursor-pointer fs-14 pe-3 ps-0"
        type="button"
        @click="$emit('input', max)"
      >
        {{ maxLabel }}:
        <app-countup :value="max" :decimals="2" />
      </button>
      <slot name="append" />
    </div>
  </fieldset>
</template>

<script>
import Bignumber from "bignumber.js";

export default {
	props: {
		id: {
			type: String,
			default: "",
		},
		value: {
			type: Bignumber,
			default: () => null,
		},
		showMax: {
			type: Boolean,
			default: true,
		},
		maxLabel: {
			type: String,
			default: () => "Max:",
		},
		showMaxBtn: {
			type: Boolean,
			default: false,
		},
		groupClass: {
			type: [String, Array, Object],
			default: () => "",
		},
		inputClass: {
			type: [String, Array, Object],
			default: () => "",
		},
		placeholder: {
			type: String,
			default: () => "",
		},
		max: {
			type: Bignumber,
			default: () => null,
		},
		disabled: {
			type: Boolean,
			dafault: () => false,
		},
		required: {
			type: Boolean,
			dafault: () => false,
		},
	},
	data() {
		return {
			inputValue: null,
			focused: false,
		};
	},
	computed: {
		labelClass() {
			if (this.$slots["label-left"]) {
				return "justify-content-between";
			}
			if (this.$slots["label-right"]) {
				return "justify-content-end";
			}
			return "";
		},
	},
	watch: {
		value(to) {
			this.inputValue = to;
		},
		max(to) {
			if (to.isLessThan(this.inputValue)) {
				this.inputValue = to.toString();
			}
		},
	},
	methods: {
		onInput(e) {
			const parts = e.target.value.split(".");
			if (parts.length === 2 && (parts[1].match(/[0]+$/) || !parts[1].length)) {
				this.inputValue = e.target.value;
				return;
			}
			let value = new Bignumber(e.target.value);
			if (value.isNaN()) {
				this.$emit("input", null);
				return;
			}
			value = new Bignumber(value);
			if (this.max) {
				value = Bignumber.minimum(value, this.max);
			}
			this.$emit("input", value);
		},
	},
};
</script>
