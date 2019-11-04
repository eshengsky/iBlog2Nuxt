<template>
  <blog-article :article="article"></blog-article>
</template>
<script>
import BlogArticle from "~/components/BlogArticle.vue";
export default {
  components: {
    BlogArticle
  },
  data() {
    return {
      article: {
        comments: []
      }
    };
  },
  async asyncData({ $axios, params, error }) {
    const alias = params.article;
    const { code, data: article } = await $axios.$get("/api/article", {
      params: {
        alias
      }
    });
    if (code === 1 && article) {
      return {
        article
      };
    } else {
      error({
        statusCode: 404,
        message: "未找到该页面"
      });
    }
  }
};
</script>