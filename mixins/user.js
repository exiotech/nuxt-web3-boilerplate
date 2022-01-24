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
      userMixin_userTimer: null,
    };
  },

  methods: {
    ...mapActions({
      login: "auth/login",
      userMixin_loadUserDataAction: "user/loadData",
    }),

    async userMixin_loadUserData() {
      if (this.address) {
        await this.login();
        await this.userMixin_loadUserDataAction();

        clearTimeout(this.userMixin_userTimer);

        this.userMixin_userTimer = setTimeout(this.userMixin_loadUserData, USER_UPDATE_INTERVAL);
      }
    },
  },

  watch: {
    address(to) {
      if (to) {
        clearTimeout(this.userMixin_userTimer);
        this.userMixin_loadUserData();
      }
    },
  },

  destroyed() {
    clearTimeout(this.userMixin_userTimer);
  },
};
