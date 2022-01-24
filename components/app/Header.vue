<template>
  <header class="bg-dark header">
    <nav
      class="navbar navbar-expand-md navbar-dark bg-dark"
      aria-label="Fourth navbar example"
    >
      <div class="container">
        <nuxt-link
          to="/"
          class="navbar-logo d-flex align-items-center me-5"
          >{{ appName }}</nuxt-link
        >
        <button
          class="navbar-toggler"
          type="button"
          aria-controls="navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="navbar" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/">Home</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/send-eth">Send ETH</nuxt-link>
            </li>
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/send-token">Send Token</nuxt-link>
            </li>
          </ul>
          <web3-connection-placeholder>
            <p slot-scope="app" class="mb-0 text-primary">
              {{ app.address.slice(0, 6) }}....{{ app.address.slice(-4) }}
            </p>
          </web3-connection-placeholder>
        </div>
      </div>
    </nav>
  </header>
</template>
<script>
export default {
  computed: {
    appName() {
      return process.env.app.name;
    },
  },
};
</script>
<style lang="scss">
.header {
  height: $height-footer;
  line-height: $height-footer;
}
</style>