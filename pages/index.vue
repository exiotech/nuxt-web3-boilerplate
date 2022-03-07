<template>
  <main class="page-content">
    <div class="container text-center">
      <h1 class="mt-5">Hello!</h1>
    </div>
  </main>
</template>

<script>
import user from "@/mixins/user";

export default {
	name: 'Homepage',
	mixins: [user],
};
</script>

<style lang="scss">
.form-container {
  max-width: 400px;
}
</style>
