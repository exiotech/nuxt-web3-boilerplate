<template>
  <footer class="footer bg-light border-top py-3">
    <div class="container">
      <div class="row">
        <div class="col">
          Copyright Exio.tech {{ year }}
        </div>
        <div class="col-auto">
          Developed by Exio.tech
        </div>
      </div>
    </div>
  </footer>
</template>
<script>
export default {
  computed: {
    year() {
      const date = new Date();
      return date.getFullYear();
    },
  },
};
</script>
<style lang="scss" scoped>
.footer {
  height: $height-footer;
}
</style>
