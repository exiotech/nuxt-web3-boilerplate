<template>
  <div id="app">
    <app-header />
    <nuxt />
    <client-only>
      <popups-unlock />
      <popups-transaction />
    </client-only>
    <popups-unsupported-network />
    <app-footer />
  </div>
</template>
<script>
export default {};
</script>
