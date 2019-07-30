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
  async validate({ params, store }) {
    const category = params.category || '';
    await store.dispatch('getCategories');
    return store.state.categoryList.some(
      item => item.alias === category
    );
  }
};
</script>

<style>
</style>
