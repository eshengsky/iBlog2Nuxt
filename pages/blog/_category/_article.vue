<template>
  <blog-article></blog-article>
</template>
<script>
import BlogArticle from "~/components/BlogArticle.vue";
export default {
  asyncData({ req, store }) {
    store.commit("setData", {
      user: req.user
    });
  },
  components: {
    BlogArticle
  },
  async validate({ params, store }) {
    const alias = params.article;
    store.commit("setData", {
      articleAlias: alias
    });
    await store.dispatch("getArticle");
    return !!store.state.article;
  }
};
</script>