<template>
  <div class="detail-wrap">
    <article class="article-wrap">
      <header class="article-title">
        <span>
          <font-awesome-icon :icon="['far', 'clock']"></font-awesome-icon>
          {{ article.createTimeStr }}
        </span>
        <h1>{{ article.title }}</h1>
      </header>
      <main>
        <blockquote v-if="article.summary">{{ article.summary }}</blockquote>
        <div class="article-content" v-html="article.html"></div>
      </main>
      <div class="comments-wrap">
        <div>{{ JSON.stringify($auth.$state) }}</div>
        <div @click="loginWithGithub">登录</div>
        <div @click="$auth.logout()">退出</div>
        <button @click="test">get data</button>
      </div>
    </article>
    <aside>Menu</aside>
  </div>
</template>
<script>
import { mapState } from "vuex";
import "highlight.js/styles/tomorrow.css";
export default {
  computed: mapState({
    article: state => state.article
  }),
  methods: {
    loginWithGithub() {
      this.$auth.loginWith('github');
    },
    test() {
      console.log(this.$auth)
    }
  }
};
</script>
<style scoped>
.detail-wrap {
  background: #f3f3f4;
  min-height: 100vh;
  padding-top: 30px;
}

.article-wrap {
  max-width: 1012px;
  margin: 0 auto 20px;
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
}

.article-content {
  font-family: Consolas, "Courier New", monospace;
}
</style>