<template>
  <div>
    <blog-article></blog-article>
  </div>
</template>
<script>
import BlogArticle from "~/components/BlogArticle.vue";
export default {
  components: {
    BlogArticle
  },
  async validate({ params, store }) {
    const alias = params.article;
    store.commit('setData', {
      key: 'articleAlias',
      value: alias
    });
    await store.dispatch('getArticle');
    return !!store.state.article;
  }
};
</script>