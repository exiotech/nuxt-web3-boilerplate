<script>
export default {
	data() {
		return {
			show: false,
			events: [],
		};
	},

	computed: {
		eventName() {
			return (
				this.name ||
        this._name.toLowerCase().replace("<", "").replace(">", "").replace("popups", "")
			);
		},
	},

	beforeDestroy() {
		this.unregisterEvents();
	},

	mounted() {
		this.registerEvent("open", this.open);
		this.registerEvent("close", this.close);
		this.registerEvent("toggle", this.toggle);
	},

	methods: {
		registerEvent(name, callback) {
			this.$nuxt.$on(`popups.${this.eventName}.${name}`, callback);
			this.events.push(name);
		},
		unregisterEvents() {
			this.events.forEach((name) => {
				this.$nuxt.$off(`popups.${this.eventName}.${name}`);
			});
		},
		open() {
			console.log(this.name, "OPEN");
			this.show = true;
		},
		close() {
			this.show = false;
		},
		toggle() {
			this.show = !this.show;
		},
	},
};
</script>
