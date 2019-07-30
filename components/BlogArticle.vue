<template>
  <div class="article-container">
    <article>
      <header class="post-title">
        <span>{{ article.createTimeStr }}</span>
        <h1>{{ article.title }}</h1>
      </header>
      <main>
        <blockquote v-if="article.summary">{{ article.summary }}</blockquote>
        <article-content :content="article.html"></article-content>
      </main>
    </article>
    <aside>Menu</aside>
  </div>
</template>
<script>
import { mapState } from "vuex";
import ArticleContent from "~/components/ArticleContent.vue";
export default {
  components: {
    ArticleContent
  },
  computed: mapState({
    article: state => state.article
  })
};
</script>
<style scoped>
.article-container {
  max-width: 75rem;
  margin: 0 auto;
}
</style>