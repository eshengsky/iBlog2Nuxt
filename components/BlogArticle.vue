<template>
  <div class="main-container">
    <article>
      <header class="post-title">
        <span>{{ article.createTimeStr }}</span>
        <h1>{{ article.title }}</h1>
      </header>
      <main>
        <blockquote v-if="article.summary">{{ article.summary }}</blockquote>
        <div v-html="article.html"></div>
      </main>
    </article>
    <aside>Menu</aside>
  </div>
</template>
<script>
import { mapState } from "vuex";
import "highlight.js/styles/tomorrow-night.css";
export default {
  computed: mapState({
    article: state => state.article
  })
};
</script>
<style scoped>
.main-container {
  max-width: 75rem;
  margin: 0 auto;
}
</style>