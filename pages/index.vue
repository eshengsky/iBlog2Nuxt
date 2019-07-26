<template>
  <div>
    <category-list></category-list>
    <post-list></post-list>
  </div>
</template>

<script>
import CategoryList from "~/components/CategoryList.vue";
import PostList from "~/components/PostList.vue";
export default {
  components: {
    CategoryList,
    PostList
  },
  async fetch({ store }) {
    await store.dispatch("getCategories");
  }
};
</script>

<style>
</style>
