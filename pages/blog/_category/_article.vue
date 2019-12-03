<template>
  <div class="detail-wrap">
    <article class="article-wrap">
      <header class="article-title">
        <span>
          <font-awesome-icon :icon="['far', 'clock']"></font-awesome-icon>
          {{ article.createTime }}
        </span>
        <h1>{{ article.title }}</h1>
      </header>
      <main class="article-main">
        <div class="article-content" v-html="article.html"></div>
      </main>
      <comment-list :from="2" :articleId="article._id"></comment-list>
    </article>
    <aside>
      <!-- TODO:目录 -->
    </aside>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import "highlight.js/styles/tomorrow.css";
import CommentList from "~/components/CommentList.vue";
export default Vue.extend({
  components: {
    CommentList
  },
  data() {
    return {
      article: {}
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
});
</script>
<style>
.detail-wrap {
  background: #f3f3f4;
  min-height: 100vh;
  padding-top: 30px;
}

.article-wrap {
  max-width: 1012px;
  margin: 0 auto;
  padding: 40px 30px;
  background: #fff;
  border-color: #e7eaec;
  border-style: solid solid none;
  border-width: 1px 0;
  transition: width 0.3s;
  min-height: 400px;
}

.article-title {
  margin: 40px 0 100px;
  text-align: center;
}

.article-title span {
  color: #777;
}

.article-title h1 {
  font-size: 25px;
  font-weight: 500;
  margin-top: 8px;
}

.article-main {
  min-height: 50vh;
}
</style>