<template>
  <div id="app">
    <AppHeader />
    <nuxt />
    <ClientOnly>
      <PopupsUnlock />
      <PopupsTransaction />
    </ClientOnly>
    <PopupsUnsupportedNetwork />
    <AppFooter />
  </div>
</template>


<script setup>
const { $ethereum, $setWeb3Provider, $store, $localForage } = useNuxtApp();

onMounted(async () => {
  try {
    const provider = await $localForage.getItem("provider");
    const int = setInterval(() => {
      if ($ethereum()) {
        if (["injected", "binance"].includes(provider)) {
          $setWeb3Provider(provider);
          $store.dispatch('auth/login')
            .catch((err) => {
              console.error(err);
              return $localForage.removeItem("provider");
            });
        }
        clearInterval(int);
      }
    }, 3000);
  } catch (err) {
    console.error(err);
  }
});
</script>

<script>
export default {
  name: "default",
};
</script>
