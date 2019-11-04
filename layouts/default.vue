<template>
  <div class="container">
    <nav-header></nav-header>
    <nuxt />
  </div>
</template>
<script>
import NavHeader from "~/components/NavHeader.vue";
export default {
  components: {
    NavHeader
  }
};
</script>
