import { mapGetters, mapActions } from "vuex";

const USER_UPDATE_INTERVAL = 3000;

export default {
  computed: {
    ...mapGetters({
      address: "auth/address",
      balanceOf: "user/assets/balanceOf",
    }),
  },

  data() {
    return {
      userTimer: null,
    };
  },

  methods: {
    ...mapActions({
      login: "auth/login",
      _loadUserData: "user/loadData",
    }),

    async __loadUserData() {
      if (this.address) {
        await this.login();
        await this._loadUserData();

        clearTimeout(this.userTimer);

        this.userTimer = setTimeout(this.__loadUserData, USER_UPDATE_INTERVAL);
      }
    },
  },

  watch: {
    address(to) {
      if (to) {
        clearTimeout(this.userTimer);
        this.__loadUserData();
      }
    },
  },

  async mounted() {
    try {
      const provider = await this.$localForage.getItem("provider");
      const int = setInterval(() => {
        if (this.$ethereum()) {
          if (["injected", "binance"].includes(provider)) {
            this.$setWeb3Provider(provider);
            this.login()
              .then((d) => {
                console.log(d);
              })
              .catch((err) => {
                console.error(err);
                return this.$localForage.removeItem("provider");
              });
          }
          clearInterval(int);
        }
      }, 3000);
    } catch (err) {
      console.error(err);
    }

    await this.__loadUserData();
  },

  destroyed() {
    clearTimeout(this.userTimer);
  },
};
